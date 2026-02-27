#!/usr/bin/env bash
set -euo pipefail

# Release script for bumping package version
# Usage: ./scripts/release.sh VERSION

VERSION="${1:-}"

usage() {
  echo "Usage: $0 VERSION"
  echo "Example: $0 1.5.0"
  exit 1
}

if [[ -z "$VERSION" ]]; then
  echo "Error: VERSION argument is required"
  usage
fi

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: VERSION must be in semver format (e.g., 1.5.0)"
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: Must be on main branch (currently on $CURRENT_BRANCH)"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: Working tree is not clean. Commit or stash changes first."
  exit 1
fi

if [[ ! -f "package.json" ]]; then
  echo "Error: package.json not found"
  exit 1
fi

OLD_VERSION=$(node -p "require('./package.json').version")
if [[ -z "$OLD_VERSION" ]]; then
  echo "Error: Could not extract current version from package.json"
  exit 1
fi

echo "Bumping version: $OLD_VERSION -> $VERSION"

VERSION="$VERSION" node <<'NODE'
const fs = require('fs');

const version = process.env.VERSION;

const updateJson = (file) => {
  if (!fs.existsSync(file)) return false;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.version = version;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return true;
};

updateJson('package.json');
updateJson('package-lock.json');
NODE

git add package.json package-lock.json 2>/dev/null || git add package.json
git commit -m "chore: bump version to $VERSION"
git tag "v$VERSION"
git push origin main "v$VERSION"

echo "Released v$VERSION"
