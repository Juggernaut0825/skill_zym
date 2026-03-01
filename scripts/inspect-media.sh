#!/usr/bin/env bash
# inspect-media.sh — 基于已保存媒体做结构化分析
# Usage: bash scripts/inspect-media.sh --media-id <media_id> --question "<question>" --domain training|food|chart|generic

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

source "$PROJECT_DIR/.env" 2>/dev/null || { echo "ERROR: .env not found"; exit 1; }

python3 - "$SCRIPT_DIR" "$OPENROUTER_API_KEY" "$@" << 'PY'
import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

script_dir = Path(sys.argv[1])
api_key = sys.argv[2]
sys.path.insert(0, str(script_dir))

from media_common import (  # noqa: E402
    resolve_media,
    resolve_stored_path,
    strip_json_payload,
    openrouter_chat,
    write_analysis,
)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument("--media-id", required=True)
    parser.add_argument("--question", default="")
    parser.add_argument("--domain", default="generic", choices=["training", "food", "chart", "generic"])
    return parser.parse_args(argv)


def encode_file(path: Path) -> str:
    with path.open("rb") as handle:
        return base64.b64encode(handle.read()).decode("utf-8")


def ffprobe_duration(path: Path):
    if shutil.which("ffprobe") is None:
        return None
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            capture_output=True,
            text=True,
            check=True,
        )
        return float(result.stdout.strip())
    except Exception:
        return None


def extract_frames(path: Path):
    if shutil.which("ffmpeg") is None:
        return [], None, "ffmpeg unavailable"

    duration = ffprobe_duration(path)
    if not duration or duration <= 0:
        duration = 4.0

    time_points = sorted(set([max(duration * 0.1, 0.1), duration * 0.35, duration * 0.6, max(duration * 0.85, 0.2)]))
    temp_dir = Path(tempfile.mkdtemp(prefix="zym-frames-"))
    frames = []

    try:
        for index, second in enumerate(time_points):
            target = temp_dir / f"frame_{index}.jpg"
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-ss",
                    f"{second:.2f}",
                    "-i",
                    str(path),
                    "-frames:v",
                    "1",
                    str(target),
                ],
                capture_output=True,
                check=True,
            )
            if target.exists():
                frames.append(target)
    except Exception:
        shutil.rmtree(temp_dir, ignore_errors=True)
        return [], None, "ffmpeg extraction failed"

    return frames, temp_dir, None


def build_prompt(domain: str, question: str, media_kind: str, frame_mode: bool) -> str:
    base = {
        "training": "这是训练相关媒体。重点看动作名称、可见重量配置、片子颜色、次数、姿势与风险。",
        "food": "这是饮食相关媒体。重点看食物种类、份量、可见证据和热量估计区间。",
        "chart": "这是截图或图表。重点看图里的数字、标签、趋势和截图中实际可见的内容。",
        "generic": "这是通用媒体。重点回答用户问题，并明确哪些内容看得清、哪些看不清。",
    }[domain]

    frame_note = (
        "你拿到的是从视频中抽取的关键帧，不是完整视频，因此如果动作连续性不足，请降低置信度。"
        if frame_mode
        else "如果媒体本身不够清晰或视角遮挡，请降低置信度。"
    )

    return f"""你在做媒体检查。{base}
用户问题：{question or '请先给出基线分析。'}
媒体类型：{media_kind}
{frame_note}

规则：
1. 只能根据实际可见证据判断，不要脑补。
2. 对重量、颜色、次数、标签、动作名称这种容易错的视觉细节，如果不确定必须明确写 low/medium confidence。
3. 如果存在多个合理解释，放到 derived.scenarios 里。
4. 如果是训练媒体，除非很有把握，否则 needsConfirmation 必须为 true。
5. 回答用中文。

返回 ONLY JSON：
{{
  "kind": "focused_qa 或 baseline",
  "confidence": "low|medium|high",
  "answerSummary": "简短总结",
  "evidence": [
    {{
      "label": "证据标签",
      "observation": "观察到的内容",
      "confidence": "low|medium|high"
    }}
  ],
  "ambiguities": ["不确定点1"],
  "derived": {{
    "scenarios": [
      {{
        "label": "候选场景",
        "totalWeightKg": 69.1
      }}
    ]
  }},
  "proposedTrainingEntry": {{
    "name": "Power Clean",
    "sets": 1,
    "reps": "1",
    "weight_kg": 69.1
  }},
  "needsConfirmation": true
}}"""


def normalize_confidence(value: str) -> str:
    if value in {"low", "medium", "high"}:
        return value
    return "low"


def normalize_result(raw_result: dict, media_id: str, domain: str, question: str, default_kind: str):
    confidence = normalize_confidence(str(raw_result.get("confidence", "low")).lower())
    evidence = []
    for item in raw_result.get("evidence", []):
        if not isinstance(item, dict):
            continue
        evidence.append(
            {
                "label": str(item.get("label", "evidence")),
                "observation": str(item.get("observation", "")),
                "confidence": normalize_confidence(str(item.get("confidence", confidence)).lower()),
            }
        )

    ambiguities = [str(item) for item in raw_result.get("ambiguities", []) if str(item).strip()]
    derived = raw_result.get("derived") if isinstance(raw_result.get("derived"), dict) else {}
    proposed = raw_result.get("proposedTrainingEntry")
    if not isinstance(proposed, dict):
        proposed = None

    created_at = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    analysis_id = f"ana_{created_at.replace('-', '').replace(':', '').replace('T', '_').replace('Z', '')}_{domain}_{default_kind}"

    return {
        "id": analysis_id,
        "mediaId": media_id,
        "kind": str(raw_result.get("kind", default_kind)),
        "domain": domain,
        "question": question,
        "confidence": confidence,
        "answerSummary": str(raw_result.get("answerSummary", "无法稳定确认媒体内容")),
        "evidence": evidence,
        "ambiguities": ambiguities,
        "derived": derived,
        "proposedTrainingEntry": proposed,
        "needsConfirmation": bool(raw_result.get("needsConfirmation", confidence != "high")),
        "createdAt": created_at,
    }


args = parse_args(sys.argv[3:])
media = resolve_media(args.media_id)
file_path = resolve_stored_path(media["storedPath"])
if not file_path.exists():
    raise FileNotFoundError(f"stored media not found: {file_path}")

media_kind = media.get("kind", "image")
mime_type = media.get("mimeType", "image/jpeg")
question = args.question.strip()
default_kind = "focused_qa" if question else "baseline"
prompt = build_prompt(args.domain, question, media_kind, False)

content = []
temp_frame_dir = None

try:
    if media_kind == "video":
        frames, temp_frame_dir, frame_error = extract_frames(file_path)
        if frames:
            prompt = build_prompt(args.domain, question, media_kind, True)
            for frame in frames:
                content.append(
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{encode_file(frame)}"},
                    }
                )
        else:
            if frame_error:
                prompt += f"\n补充说明：{frame_error}。请主动降低置信度。"
            content.append(
                {
                    "type": "video_url",
                    "video_url": {"url": f"data:{mime_type};base64,{encode_file(file_path)}"},
                }
            )
    else:
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:{mime_type};base64,{encode_file(file_path)}"},
            }
        )

    content.append({"type": "text", "text": prompt})

    payload = openrouter_chat(api_key, os.environ.get("GAUZ_LLM_MODEL", "google/gemini-3-flash-preview"), content)
    raw = payload["choices"][0]["message"]["content"]
    result = json.loads(strip_json_payload(raw))
    normalized = normalize_result(result, args.media_id, args.domain, question, default_kind)
    write_analysis(args.media_id, normalized["id"], normalized)
    print(json.dumps(normalized, ensure_ascii=False))
finally:
    if temp_frame_dir:
        shutil.rmtree(temp_frame_dir, ignore_errors=True)
PY
