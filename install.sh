#!/usr/bin/env bash
# install.sh — Install ECC configs for Codex.
#
# Usage:
#   ./install.sh <language> [<language> ...]
#
# Examples:
#   ./install.sh typescript
#   ./install.sh typescript python golang

set -euo pipefail

# Resolve symlinks — needed when invoked as `ecc-install` via npm/bun bin symlink
SCRIPT_PATH="$0"
while [ -L "$SCRIPT_PATH" ]; do
    link_dir="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
    SCRIPT_PATH="$(readlink "$SCRIPT_PATH")"
    [[ "$SCRIPT_PATH" != /* ]] && SCRIPT_PATH="$link_dir/$SCRIPT_PATH"
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
RULES_DIR="$SCRIPT_DIR/rules"

validate_lang_name() {
    local lang="$1"
    if [[ ! "$lang" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        echo "Error: invalid language name '$lang'. Only alphanumeric, dash, and underscore allowed." >&2
        return 1
    fi
    return 0
}

if [[ "${1:-}" == "--target" ]]; then
    echo "Error: --target is no longer supported. This installer is Codex-only." >&2
    exit 1
fi

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <language> [<language> ...]"
    echo
    echo "Target:"
    echo "  codex — Install full workspace assets to ./.codex/"
    echo
    echo "Available languages:"
    for dir in "$RULES_DIR"/*/; do
        name="$(basename "$dir")"
        [[ "$name" == "common" ]] && continue
        echo "  - $name"
    done
    exit 1
fi

DEST_DIR=".codex"
echo "Installing Codex configs to $DEST_DIR/"

echo "Installing common rules -> $DEST_DIR/rules/common/"
mkdir -p "$DEST_DIR/rules/common"
cp -r "$RULES_DIR/common/." "$DEST_DIR/rules/common/"

for lang in "$@"; do
    if ! validate_lang_name "$lang"; then
        continue
    fi
    lang_dir="$RULES_DIR/$lang"
    if [[ ! -d "$lang_dir" ]]; then
        echo "Warning: rules/$lang/ does not exist, skipping." >&2
        continue
    fi
    echo "Installing $lang rules -> $DEST_DIR/rules/$lang/"
    mkdir -p "$DEST_DIR/rules/$lang"
    cp -r "$lang_dir/." "$DEST_DIR/rules/$lang/"
done

for component in agents skills commands contexts mcp-configs; do
    src="$SCRIPT_DIR/$component"
    dst="$DEST_DIR/$component"
    if [[ -d "$src" ]]; then
        echo "Installing $component -> $dst/"
        mkdir -p "$dst"
        cp -r "$src/." "$dst/"
    fi
done

if [[ -f "$SCRIPT_DIR/docs/codex/README.md" ]]; then
    cp "$SCRIPT_DIR/docs/codex/README.md" "$DEST_DIR/README.md"
    echo "Installing Codex migration guide -> $DEST_DIR/README.md"
fi

if [[ -f "$SCRIPT_DIR/examples/AGENTS.md" ]]; then
    cp "$SCRIPT_DIR/examples/AGENTS.md" "$DEST_DIR/AGENTS.ecc.md"
    echo "Installing AGENTS template -> $DEST_DIR/AGENTS.ecc.md"
fi

if [[ -f "$SCRIPT_DIR/examples/user-AGENTS.md" ]]; then
    cp "$SCRIPT_DIR/examples/user-AGENTS.md" "$DEST_DIR/user-AGENTS.ecc.md"
    echo "Installing user AGENTS template -> $DEST_DIR/user-AGENTS.ecc.md"
fi

if [[ ! -f "AGENTS.md" && -f "$SCRIPT_DIR/examples/AGENTS.md" ]]; then
    cp "$SCRIPT_DIR/examples/AGENTS.md" "AGENTS.md"
    echo "Created project AGENTS.md from ECC template."
else
    echo "AGENTS.md already exists; kept existing file."
fi

echo "Done. Codex configs installed to $DEST_DIR/"
