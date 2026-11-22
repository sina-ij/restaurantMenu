#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Read-only check: is the server running the same commit as your local repo?
# Changes nothing. Run it any time to confirm you are in sync.
#
#   bash scripts/deploy-check.sh      (or: npm run deploy:check)
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR="/var/www/restaurant-qr-menu"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SRV="$HOME/.claude/skills/deploy-to-my-server/scripts/srv.sh"
# shellcheck disable=SC1090
source "$SRV"

LOCAL="$(git rev-parse HEAD)"
LOCAL_SHORT="$(git rev-parse --short HEAD)"
git fetch origin --quiet 2>/dev/null || true
ORIGIN="$(git rev-parse origin/"$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null || echo '?')"
DIRTY="no"; git diff --quiet && git diff --cached --quiet || DIRTY="yes"

SERVER="$(rsh "cd $APP_DIR && git rev-parse HEAD" | tr -d '\r\n')"
SERVER_SHORT="${SERVER:0:7}"

echo "local  : $LOCAL_SHORT  (uncommitted changes: $DIRTY)"
echo "origin : ${ORIGIN:0:7}"
echo "server : $SERVER_SHORT"
echo

if [ "$LOCAL" = "$SERVER" ] && [ "$DIRTY" = "no" ]; then
  echo "✓ In sync. Server is running exactly your local commit."
elif [ "$LOCAL" = "$SERVER" ] && [ "$DIRTY" = "yes" ]; then
  echo "~ Server matches your last commit, but you have uncommitted local changes."
  echo "  Commit them and run: npm run deploy"
else
  echo "✗ Out of sync. Run: npm run deploy"
fi
