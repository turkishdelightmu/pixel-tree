#!/usr/bin/env bash
# Installs git hooks from the hooks/ directory into .git/hooks/
# Run once after cloning: bash scripts/install-hooks.sh

set -euo pipefail

HOOKS_DIR="$(git rev-parse --show-toplevel)/scripts/hooks"
GIT_HOOKS_DIR="$(git rev-parse --show-toplevel)/.git/hooks"

if [[ ! -d "$HOOKS_DIR" ]]; then
  echo "No scripts/hooks/ directory found — nothing to install."
  exit 0
fi

for hook in "$HOOKS_DIR"/*; do
  name="$(basename "$hook")"
  cp "$hook" "$GIT_HOOKS_DIR/$name"
  chmod +x "$GIT_HOOKS_DIR/$name"
  echo "Installed hook: $name"
done

echo "Git hooks installed successfully."
