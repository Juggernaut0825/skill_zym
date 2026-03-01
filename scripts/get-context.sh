#!/usr/bin/env bash
# get-context.sh — 读取当前用户的会话上下文
# Usage: bash scripts/get-context.sh [--scope summary|recent|full] [--limit 6] [--json]

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

python3 - "$SCRIPT_DIR" "$@" << 'PY'
import argparse
import json
import sys
from pathlib import Path

script_dir = Path(sys.argv[1])
sys.path.insert(0, str(script_dir))

from media_common import get_session_file, load_json  # noqa: E402


def empty_session():
    return {
        "schemaVersion": 1,
        "userId": "",
        "rollingSummary": "",
        "pinnedFacts": [],
        "recentMessages": [],
        "activeMediaIds": [],
        "lastMessageAt": None,
    }


def role_label(role: str, tool_name):
    if role == "user":
        return "用户"
    if role == "assistant":
        return "助手"
    if role == "tool":
        return f"工具({tool_name})" if tool_name else "工具"
    return role


parser = argparse.ArgumentParser()
parser.add_argument("--scope", choices=["summary", "recent", "full"], default="recent")
parser.add_argument("--limit", type=int, default=6)
parser.add_argument("--json", action="store_true")
args = parser.parse_args(sys.argv[2:])

session = load_json(get_session_file(), empty_session())
recent_messages = session.get("recentMessages", [])
limit = max(args.limit, 1)

if args.scope == "summary":
    selected_messages = []
elif args.scope == "recent":
    selected_messages = recent_messages[-limit:]
else:
    selected_messages = recent_messages

payload = {
    "rollingSummary": session.get("rollingSummary", ""),
    "pinnedFacts": session.get("pinnedFacts", []),
    "recentMessages": selected_messages,
    "activeMediaIds": session.get("activeMediaIds", []),
    "lastMessageAt": session.get("lastMessageAt"),
}

if args.json:
    print(json.dumps(payload, ensure_ascii=False))
    sys.exit(0)

print("=== 会话上下文 ===")
print(f"范围: {args.scope}")
print()
print("摘要:")
print(payload["rollingSummary"] or "（空）")
print()
print("固定事实:")
if payload["pinnedFacts"]:
    for fact in payload["pinnedFacts"]:
        print(f"- {fact}")
else:
    print("（空）")
print()
print("最近消息:")
if payload["recentMessages"]:
    for index, message in enumerate(payload["recentMessages"], 1):
        role = role_label(message.get("role", "unknown"), message.get("toolName"))
        text = str(message.get("text", "")).replace("\n", " ").strip() or "（空）"
        media_ids = message.get("mediaIds") or []
        media_suffix = ""
        if media_ids and "[media:" not in text:
            media_suffix = f" {' '.join(f'[media:{media_id}]' for media_id in media_ids)}"
        print(f"{index}. {role}: {text}{media_suffix}")
else:
    print("（空）")
print()
print("活跃媒体:")
if payload["activeMediaIds"]:
    for media_id in payload["activeMediaIds"]:
        print(f"- {media_id}")
else:
    print("（空）")
print()
print(f"最后更新时间: {payload['lastMessageAt'] or '（未知）'}")
PY
