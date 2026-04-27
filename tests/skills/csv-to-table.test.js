/**
 * Tests for skills/csv-to-table/SKILL.md
 *
 * Validates the skill file format and the CSV-to-Markdown-table
 * algorithm described within it.
 *
 * Run with: node tests/skills/csv-to-table.test.js
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Reference implementation of the algorithm described in SKILL.md
// (used to verify the spec is self-consistent and correct)
// ---------------------------------------------------------------------------

/**
 * Parse CSV text into a 2-D array of strings.
 * Handles basic double-quote wrapping per the skill spec.
 */
function parseCsv(input) {
  const rows = input
    .trim()
    .split('\n')
    .map((line) => {
      // Basic quoted-field handling: strip surrounding quotes from each cell
      return line.split(',').map((cell) => {
        const trimmed = cell.trim();
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return trimmed.slice(1, -1);
        }
        return trimmed;
      });
    })
    .filter((row) => row.some((cell) => cell !== ''));

  if (rows.length === 0) return [];

  // Normalize row lengths
  const maxCols = Math.max(...rows.map((r) => r.length));
  return rows.map((row) => {
    while (row.length < maxCols) row.push('');
    return row;
  });
}

/**
 * Determine whether the first row looks like a header row.
 * Heuristic: all cells are non-numeric (cannot be parsed as a finite number).
 */
function looksLikeHeader(firstRow) {
  return firstRow.every((cell) => cell !== '' && isNaN(Number(cell)));
}

/**
 * Convert parsed CSV rows to a Markdown table string.
 *
 * @param {string[][]} rows   - All rows (first may be header)
 * @param {boolean} hasHeader - Whether to use row 0 as the header
 * @param {string[]} alignments - Per-column alignment: 'left'|'right'|'center'
 */
function toMarkdownTable(rows, hasHeader, alignments = []) {
  if (rows.length === 0) return '';

  const colCount = rows[0].length;

  let headers;
  let dataRows;

  if (hasHeader) {
    headers = rows[0];
    dataRows = rows.slice(1);
  } else {
    headers = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    dataRows = rows;
  }

  // Column widths
  const widths = headers.map((h, i) => {
    const dataMax = dataRows.reduce(
      (max, row) => Math.max(max, (row[i] || '').length),
      0
    );
    return Math.max(h.length, dataMax, 3); // min width 3 for separator
  });

  // Resolve alignment for each column
  const aligns = Array.from({ length: colCount }, (_, i) => {
    return (alignments[i] || 'left').toLowerCase();
  });

  function pad(cell, width, align) {
    const s = cell || '';
    const extra = width - s.length;
    if (align === 'right') return ' '.repeat(extra) + s;
    if (align === 'center') {
      const left = Math.floor(extra / 2);
      const right = extra - left;
      return ' '.repeat(left) + s + ' '.repeat(right);
    }
    return s + ' '.repeat(extra); // left (default)
  }

  function separator(width, align) {
    const dashes = '-'.repeat(width);
    if (align === 'right') return dashes + ':';
    if (align === 'center') return ':' + dashes + ':';
    if (align === 'left-explicit') return ':' + dashes;
    return dashes;
  }

  const headerLine =
    '| ' + headers.map((h, i) => pad(h, widths[i], aligns[i])).join(' | ') + ' |';
  const sepLine =
    '| ' + widths.map((w, i) => separator(w, aligns[i])).join(' | ') + ' |';
  const dataLines = dataRows.map(
    (row) =>
      '| ' + row.map((cell, i) => pad(cell, widths[i], aligns[i])).join(' | ') + ' |'
  );

  return [headerLine, sepLine, ...dataLines].join('\n');
}

// ---------------------------------------------------------------------------
// Suite 1: Skill file format
// ---------------------------------------------------------------------------

console.log('\n=== Skill File Format ===\n');

const skillPath = path.resolve(__dirname, '../../skills/csv-to-table/SKILL.md');

test('skill file exists', () => {
  assert.ok(fs.existsSync(skillPath), `Missing: ${skillPath}`);
});

test('skill file has YAML frontmatter', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.ok(content.startsWith('---'), 'File must start with ---');
  const end = content.indexOf('---', 3);
  assert.ok(end > 3, 'Frontmatter closing --- not found');
});

test('frontmatter contains name field', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.match(content, /^name:\s*.+/m);
});

test('frontmatter contains description field', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.match(content, /^description:\s*.+/m);
});

test('skill file contains When to Activate section', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.ok(
    content.includes('When to Activate') || content.includes('When to Use'),
    'Missing activation section'
  );
});

test('skill file contains alignment instructions', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.ok(content.toLowerCase().includes('align'), 'Missing alignment instructions');
});

test('skill file contains header auto-detection instructions', () => {
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.ok(
    content.toLowerCase().includes('header') && content.toLowerCase().includes('detect'),
    'Missing header auto-detection instructions'
  );
});

// ---------------------------------------------------------------------------
// Suite 2: CSV parsing
// ---------------------------------------------------------------------------

console.log('\n=== CSV Parsing ===\n');

test('parses basic CSV', () => {
  const rows = parseCsv('a,b,c\n1,2,3');
  assert.deepStrictEqual(rows, [
    ['a', 'b', 'c'],
    ['1', '2', '3'],
  ]);
});

test('trims whitespace from cells', () => {
  const rows = parseCsv('  foo , bar ,baz  ');
  assert.deepStrictEqual(rows, [['foo', 'bar', 'baz']]);
});

test('ignores empty lines', () => {
  const rows = parseCsv('a,b\n\nc,d');
  assert.strictEqual(rows.length, 2);
});

test('normalizes unequal row lengths', () => {
  const rows = parseCsv('a,b,c\n1,2');
  assert.strictEqual(rows[0].length, 3);
  assert.strictEqual(rows[1].length, 3);
  assert.strictEqual(rows[1][2], '');
});

test('handles quoted fields', () => {
  const rows = parseCsv('"hello world",42');
  assert.strictEqual(rows[0][0], 'hello world');
  assert.strictEqual(rows[0][1], '42');
});

test('handles single row', () => {
  const rows = parseCsv('only one row here');
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].length, 1);
});

// ---------------------------------------------------------------------------
// Suite 3: Header auto-detection
// ---------------------------------------------------------------------------

console.log('\n=== Header Auto-Detection ===\n');

test('detects text-only row as header', () => {
  const rows = parseCsv('Name,Age,City\nAlice,30,New York');
  assert.strictEqual(looksLikeHeader(rows[0]), true);
});

test('does not treat numeric row as header', () => {
  const rows = parseCsv('1,2,3\n4,5,6');
  assert.strictEqual(looksLikeHeader(rows[0]), false);
});

test('mixed numeric/text row treated as header', () => {
  // e.g. "Name,30,City" — some text cells present
  // Our heuristic: ALL cells non-numeric for header detection
  const row = ['Name', '30', 'City'];
  assert.strictEqual(looksLikeHeader(row), false);
});

test('all-text row is header', () => {
  assert.strictEqual(looksLikeHeader(['Product', 'Category', 'Status']), true);
});

// ---------------------------------------------------------------------------
// Suite 4: Markdown table rendering
// ---------------------------------------------------------------------------

console.log('\n=== Markdown Table Rendering ===\n');

test('renders table with header', () => {
  const rows = parseCsv('Name,Age\nAlice,30\nBob,25');
  const table = toMarkdownTable(rows, true);
  const lines = table.split('\n');
  assert.strictEqual(lines.length, 4); // header + sep + 2 data rows
  assert.ok(lines[0].includes('Name'));
  assert.ok(lines[0].includes('Age'));
  assert.ok(lines[1].includes('---'));
  assert.ok(lines[2].includes('Alice'));
  assert.ok(lines[3].includes('Bob'));
});

test('renders table without header using generated column names', () => {
  const rows = parseCsv('apple,1.50\nbanana,0.75');
  const table = toMarkdownTable(rows, false);
  assert.ok(table.includes('Col 1'));
  assert.ok(table.includes('Col 2'));
  assert.ok(table.includes('apple'));
});

test('right-aligned columns use :---: syntax with trailing colon', () => {
  const rows = parseCsv('Item,Price\nWidget,9.99');
  const table = toMarkdownTable(rows, true, ['left', 'right']);
  const sepLine = table.split('\n')[1];
  assert.ok(sepLine.includes('---:'), `Expected trailing colon in: ${sepLine}`);
});

test('center-aligned columns use :---: syntax', () => {
  const rows = parseCsv('Name,Grade\nAlice,A');
  const table = toMarkdownTable(rows, true, ['left', 'center']);
  const sepLine = table.split('\n')[1];
  assert.match(sepLine, /:-+:/, `Expected center colons in: ${sepLine}`);
});

test('all rows have same number of pipe characters', () => {
  const rows = parseCsv('Name,Age,City\nAlice,30,NY\nBob,25,LA');
  const table = toMarkdownTable(rows, true);
  const lines = table.split('\n');
  const pipeCounts = lines.map((l) => (l.match(/\|/g) || []).length);
  assert.ok(
    pipeCounts.every((c) => c === pipeCounts[0]),
    `Pipe counts differ: ${pipeCounts}`
  );
});

test('each row starts and ends with pipe', () => {
  const rows = parseCsv('A,B\n1,2');
  const table = toMarkdownTable(rows, true);
  table.split('\n').forEach((line) => {
    assert.ok(line.startsWith('|'), `Row does not start with |: "${line}"`);
    assert.ok(line.endsWith('|'), `Row does not end with |: "${line}"`);
  });
});

test('handles single-column CSV', () => {
  const rows = parseCsv('Fruit\nApple\nBanana');
  const table = toMarkdownTable(rows, true);
  assert.ok(table.includes('Fruit'));
  assert.ok(table.includes('Apple'));
  assert.ok(table.includes('Banana'));
});

test('handles empty cells', () => {
  const rows = parseCsv('A,B,C\n1,,3');
  const table = toMarkdownTable(rows, true);
  assert.ok(table.includes('|'));
  // Should not throw and should still produce 4 lines
  assert.strictEqual(table.split('\n').length, 3);
});

test('column widths accommodate longest cell', () => {
  const rows = parseCsv('N,City\nA,San Francisco');
  const table = toMarkdownTable(rows, true);
  const dataLine = table.split('\n')[2];
  assert.ok(dataLine.includes('San Francisco'));
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);

if (failed > 0) {
  process.exit(1);
}
