#!/usr/bin/env node
/**
 * PreToolUse Hook: Block git push
 *
 * Prevents Claude Code from pushing to remote. Users must push manually.
 *
 * Exit codes:
 *   0 = allow (not a git push command)
 *   2 = block (git push detected)
 */
'use strict';

const MAX_STDIN = 1024 * 1024;

function run(rawInput) {
  let input;
  try {
    input = JSON.parse(rawInput);
  } catch {
    return { exitCode: 0 };
  }

  const cmd = String(input.tool_input?.command || '');
  if (/\bgit\s+push\b/.test(cmd)) {
    return {
      exitCode: 2,
      stderr: '[Hook] BLOCKED: git push is not allowed. Push manually.',
    };
  }

  return { exitCode: 0 };
}

module.exports = { run };

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) raw += chunk.substring(0, MAX_STDIN - raw.length);
  });
  process.stdin.on('end', () => {
    const result = run(raw);
    if (result.stderr) process.stderr.write(result.stderr + '\n');
    if (result.exitCode !== 0) process.exit(result.exitCode);
    process.stdout.write(raw);
  });
}
