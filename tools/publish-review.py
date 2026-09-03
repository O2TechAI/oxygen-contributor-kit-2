#!/usr/bin/env python3
"""Register an Oxygen summary/insight pair with the human-review service."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Publish generated Oxygen output to the human review queue."
    )
    parser.add_argument("--project", required=True, help="Contributed project name")
    parser.add_argument("--source", required=True, help="Agent output directory")
    parser.add_argument("--summary", required=True, type=Path, help="Path to summary.md")
    parser.add_argument("--insight", required=True, type=Path, help="Path to insight.md")
    parser.add_argument(
        "--server",
        default="http://localhost:3000",
        help="Oxygen Review server URL (default: http://localhost:3000)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    payload = {
        "projectName": args.project,
        "sourcePath": args.source,
        "summaryMarkdown": args.summary.read_text(encoding="utf-8"),
        "insightMarkdown": args.insight.read_text(encoding="utf-8"),
    }
    request = urllib.request.Request(
        f"{args.server.rstrip('/')}/api/reviews",
        data=json.dumps(payload).encode("utf-8"),
        headers={"content-type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.load(response)
    except (OSError, urllib.error.HTTPError, json.JSONDecodeError) as error:
        print(f"Unable to publish review: {error}", file=sys.stderr)
        return 1

    review = result["review"]
    print(f"Review ready: {args.server.rstrip('/')} (id: {review['id']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
