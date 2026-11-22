#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# One-command deploy for restaurant-qr-menu.
#
#   Local (your machine) is ALWAYS the source of truth.
#   Git is the sync mechanism: this pushes your local commit, then the server
#   resets HARD to that exact commit and rebuilds. The server can never drift
#   ahead of you, and it builds the identical code you have locally.
#
# Usage (from Git Bash, in the project root):
#   bash scripts/deploy.sh
#   npm run deploy            # same thing
#
# What it protects (never wiped):
#   - public/uploads/  -> real user photos, live only on the server
#   - .env             -> the server's own secrets / production DB
# A fresh backup of both is taken on the server before every deploy.
#
# Requirements: Git Bash + PuTTY (plink/pscp) + the saved server password at
#   ~/.claude/.ij-server-pass  (the srv.sh helper reads it; nothing is typed).
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR="/var/www/restaurant-qr-menu"
SERVICE="qrmenu"
REMOTE_PORT="3000"

# --- resolve repo root (works no matter where you run it from) --------------
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# --- load the server connection helper (rsh / rput / rget) ------------------
SRV="$HOME/.claude/skills/deploy-to-my-server/scripts/srv.sh"
if [ ! -f "$SRV" ]; then
  echo "ERROR: server helper not found at $SRV" >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$SRV"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "=============================================================="
echo " Deploying restaurant-qr-menu"
echo " branch: $BRANCH"
echo "=============================================================="

# --- 1. working tree must be clean -> git is the source of truth ------------
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo
  echo "✗ You have uncommitted changes. Commit them first so the server runs"
  echo "  the exact same version you have locally:"
  echo
  echo "      git add -A"
  echo '      git commit -m "describe your change"'
  echo
  git status --short
  exit 1
fi

LOCAL_COMMIT="$(git rev-parse HEAD)"
LOCAL_SHORT="$(git rev-parse --short HEAD)"

# --- 2. push local -> origin ------------------------------------------------
echo
echo "→ Pushing $BRANCH to GitHub ($LOCAL_SHORT) ..."
git push origin "$BRANCH"

# --- 3. drive the server (all logic runs remotely, streamed over stdin) -----
echo
echo "→ Updating the server ..."
echo

rsh "bash -s -- '$BRANCH' '$APP_DIR' '$SERVICE' '$REMOTE_PORT'" <<'REMOTE'
set -euo pipefail
BRANCH="$1"; APP_DIR="$2"; SERVICE="$3"; PORT="$4"
cd "$APP_DIR"

TS="$(date +%Y%m%d-%H%M%S)"

echo "  [server] backing up uploads + .env (safety net) ..."
cp -a public/uploads "/root/qrmenu-uploads-backup-$TS" 2>/dev/null || true
cp .env "/root/qrmenu-env-backup-$TS" 2>/dev/null || true
git rev-parse HEAD > "/root/qrmenu-prev-commit-$TS.txt"
# keep only the 5 most recent uploads backups so /root doesn't fill up
ls -dt /root/qrmenu-uploads-backup-* 2>/dev/null | tail -n +6 | xargs -r rm -rf

LOCK_BEFORE="$(md5sum package-lock.json 2>/dev/null | cut -d' ' -f1 || true)"

echo "  [server] fetching + hard-reset to origin/$BRANCH ..."
git fetch origin --quiet
git reset --hard "origin/$BRANCH"

# uploads is git-ignored now, so reset leaves it alone; this is pure insurance
if [ -d "/root/qrmenu-uploads-backup-$TS" ]; then
  mkdir -p public/uploads
  cp -an "/root/qrmenu-uploads-backup-$TS/." public/uploads/ 2>/dev/null || true
fi

LOCK_AFTER="$(md5sum package-lock.json 2>/dev/null | cut -d' ' -f1 || true)"
if [ "$LOCK_BEFORE" != "$LOCK_AFTER" ] || [ ! -d node_modules ]; then
  echo "  [server] dependencies changed -> npm ci ..."
  NODE_OPTIONS='--dns-result-order=ipv4first' npm ci
else
  echo "  [server] dependencies unchanged -> skipping npm ci"
fi

echo "  [server] applying DB migrations (prisma migrate deploy) ..."
npx prisma migrate deploy
echo "  [server] generating prisma client ..."
NODE_OPTIONS='--dns-result-order=ipv4first' npx prisma generate >/dev/null

echo "  [server] building (next build, IPv4-forced for Google Fonts) ..."
NODE_OPTIONS='--dns-result-order=ipv4first' npm run build

echo "  [server] restarting service: $SERVICE ..."
systemctl restart "$SERVICE"

# --- health check -----------------------------------------------------------
echo "  [server] waiting for the app to come up ..."
OK=""
for i in $(seq 1 20); do
  CODE="$(curl -s -m 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)"
  if [ "$CODE" = "200" ]; then OK="yes"; break; fi
  sleep 1
done
SERVER_COMMIT="$(git rev-parse HEAD)"
if [ "$OK" = "yes" ]; then
  echo "  [server] ✓ app is serving 200 on :$PORT"
else
  echo "  [server] ✗ app did NOT return 200 after 20s. Recent logs:"
  journalctl -u "$SERVICE" --no-pager -n 15 || true
  echo "  [server] rollback with: cd $APP_DIR && git reset --hard $(cat /root/qrmenu-prev-commit-$TS.txt) && NODE_OPTIONS='--dns-result-order=ipv4first' npm run build && systemctl restart $SERVICE"
  echo "SERVER_COMMIT=$SERVER_COMMIT"
  exit 1
fi
echo "SERVER_COMMIT=$SERVER_COMMIT"
REMOTE

echo
echo "=============================================================="
echo " ✓ Deploy complete."
echo "   Local : $LOCAL_COMMIT"
echo "   Server: now reset to the same commit and rebuilt."
echo "   Live  : https://ijcompany.ir/"
echo "=============================================================="
