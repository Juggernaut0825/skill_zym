#!/usr/bin/env python3

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List

import requests

PROJECT_DIR = Path(__file__).resolve().parent.parent


def get_user_id() -> str:
    return os.environ.get("ZJ_USER_ID", "local")


def get_data_dir() -> Path:
    custom = os.environ.get("ZJ_DATA_DIR")
    if custom:
        return Path(custom)
    return PROJECT_DIR / "data" / get_user_id()


def get_media_index_path() -> Path:
    custom = os.environ.get("ZJ_MEDIA_INDEX_FILE")
    if custom:
        return Path(custom)
    return get_data_dir() / "media" / "index.json"


def get_session_file() -> Path:
    custom = os.environ.get("ZJ_SESSION_FILE")
    if custom:
        return Path(custom)
    return get_data_dir() / "context" / "session.json"


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)


def strip_json_payload(raw: str) -> str:
    text = raw.strip()
    text = re.sub(r"^```(?:json)?", "", text, flags=re.IGNORECASE).strip()
    text = re.sub(r"```$", "", text).strip()
    return text


def openrouter_chat(api_key: str, model: str, content: List[Dict[str, Any]], max_tokens: int = 2048) -> Dict[str, Any]:
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [{"role": "user", "content": content}],
            "max_tokens": max_tokens,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()


def load_media_index() -> Dict[str, Any]:
    return load_json(get_media_index_path(), {"schemaVersion": 1, "items": []})


def save_media_index(index_data: Dict[str, Any]) -> None:
    save_json(get_media_index_path(), index_data)


def resolve_media(media_id: str) -> Dict[str, Any]:
    index_data = load_media_index()
    for item in index_data.get("items", []):
        if item.get("id") == media_id:
            return item
    raise FileNotFoundError(f"media_id not found: {media_id}")


def resolve_stored_path(stored_path: str) -> Path:
    candidate = Path(stored_path)
    if candidate.is_absolute():
        return candidate
    return PROJECT_DIR / stored_path


def append_analysis_id(media_id: str, analysis_id: str) -> None:
    index_data = load_media_index()
    updated = False
    for item in index_data.get("items", []):
        if item.get("id") == media_id:
            analysis_ids = item.get("analysisIds") or []
            if analysis_id not in analysis_ids:
                analysis_ids.append(analysis_id)
            item["analysisIds"] = analysis_ids
            updated = True
            break
    if updated:
        save_media_index(index_data)


def write_analysis(media_id: str, analysis_id: str, payload: Dict[str, Any]) -> Path:
    analysis_path = get_data_dir() / "analyses" / media_id / f"{analysis_id}.json"
    save_json(analysis_path, payload)
    append_analysis_id(media_id, analysis_id)
    return analysis_path
