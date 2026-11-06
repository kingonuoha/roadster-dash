#!/usr/bin/env bash

# Resolve project directory (works whether invoked directly or from elsewhere)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Default port to 3001 if not passed as an argument
PORT="${1:-3001}"

echo "⚡ Starting Roadster Dash on http://localhost:${PORT}"
node server.js "$PORT"
