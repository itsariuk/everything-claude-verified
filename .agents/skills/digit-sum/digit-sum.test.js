/**
 * Tests for digit-sum utility
 *
 * Run with: node digit-sum.test.js
 */

const assert = require('assert');

// Import the module
const {
  sumDigits,
  isValidDigit,
  batchSumDigits,
  generateExamples
} = require('./digit-sum');

// Test helper
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// Test suite
function runTests() {
  console.log('\n=== Testing digit-sum utility ===\n');

  let passed = 0;
  let failed = 0;

  // isValidDigit tests
  console.log('isValidDigit function:');

  if (test('accepts single digits 0-9', () => {
    for (let i = 0; i <= 9; i++) {
      assert.strictEqual(isValidDigit(i), true, `Should accept digit ${i}`);
    }
  })) passed++; else failed++;

  if (test('rejects negative numbers', () => {
    assert.strictEqual(isValidDigit(-1), false);
    assert.strictEqual(isValidDigit(-5), false);
  })) passed++; else failed++;

  if (test('rejects numbers greater than 9', () => {
    assert.strictEqual(isValidDigit(10), false);
    assert.strictEqual(isValidDigit(15), false);
    assert.strictEqual(isValidDigit(100), false);
  })) passed++; else failed++;

  if (test('rejects decimal numbers', () => {
    assert.strictEqual(isValidDigit(3.5), false);
    assert.strictEqual(isValidDigit(7.2), false);
    assert.strictEqual(isValidDigit(0.1), false);
  })) passed++; else failed++;

  if (test('rejects special numeric values', () => {
    assert.strictEqual(isValidDigit(NaN), false);
    assert.strictEqual(isValidDigit(Infinity), false);
    assert.strictEqual(isValidDigit(-Infinity), false);
  })) passed++; else failed++;

  if (test('rejects non-numeric types', () => {
    assert.strictEqual(isValidDigit('5'), false);
    assert.strictEqual(isValidDigit(null), false);
    assert.strictEqual(isValidDigit(undefined), false);
    assert.strictEqual(isValidDigit({}), false);
    assert.strictEqual(isValidDigit([]), false);
  })) passed++; else failed++;

  console.log('\nsumDigits function:');

  if (test('adds two single digits correctly', () => {
    assert.strictEqual(sumDigits(3, 5), '3 + 5 = 8');
    assert.strictEqual(sumDigits(1, 2), '1 + 2 = 3');
    assert.strictEqual(sumDigits(7, 4), '7 + 4 = 11');
  })) passed++; else failed++;

  if (test('handles zero correctly', () => {
    assert.strictEqual(sumDigits(0, 5), '0 + 5 = 5');
    assert.strictEqual(sumDigits(7, 0), '7 + 0 = 7');
    assert.strictEqual(sumDigits(0, 0), '0 + 0 = 0');
  })) passed++; else failed++;

  if (test('handles maximum digits', () => {
    assert.strictEqual(sumDigits(9, 9), '9 + 9 = 18');
    assert.strictEqual(sumDigits(8, 9), '8 + 9 = 17');
    assert.strictEqual(sumDigits(9, 1), '9 + 1 = 10');
  })) passed++; else failed++;

  if (test('handles commutative property', () => {
    assert.strictEqual(sumDigits(3, 7), '3 + 7 = 10');
    assert.strictEqual(sumDigits(7, 3), '7 + 3 = 10');
  })) passed++; else failed++;

  if (test('throws error for invalid inputs', () => {
    assert.throws(() => sumDigits(-1, 5), /Both inputs must be single digits \(0-9\)/);
    assert.throws(() => sumDigits(10, 3), /Both inputs must be single digits \(0-9\)/);
    assert.throws(() => sumDigits(3.5, 4), /Both inputs must be single digits \(0-9\)/);
    assert.throws(() => sumDigits('5', 3), /Both inputs must be single digits \(0-9\)/);
  })) passed++; else failed++;

  console.log('\nbatchSumDigits function:');

  if (test('processes multiple valid digit pairs', () => {
    const pairs = [[1, 2], [3, 4], [5, 6]];
    const results = batchSumDigits(pairs);

    assert.strictEqual(results.length, 3);
    assert.deepStrictEqual(results[0], {
      index: 0,
      success: true,
      input: [1, 2],
      result: '1 + 2 = 3',
      sum: 3
    });
    assert.deepStrictEqual(results[2], {
      index: 2,
      success: true,
      input: [5, 6],
      result: '5 + 6 = 11',
      sum: 11
    });
  })) passed++; else failed++;

  if (test('handles mixed valid and invalid pairs', () => {
    const pairs = [[1, 2], [10, 3], [5, 6], [-1, 4]];
    const results = batchSumDigits(pairs);

    assert.strictEqual(results.length, 4);
    assert.strictEqual(results[0].success, true);
    assert.strictEqual(results[1].success, false);
    assert.strictEqual(results[2].success, true);
    assert.strictEqual(results[3].success, false);
    assert.strictEqual(results[1].error, 'Both inputs must be single digits (0-9)');
    assert.strictEqual(results[3].error, 'Both inputs must be single digits (0-9)');
  })) passed++; else failed++;

  if (test('handles empty array', () => {
    const results = batchSumDigits([]);
    assert.deepStrictEqual(results, []);
  })) passed++; else failed++;

  console.log('\ngenerateExamples function:');

  if (test('generates 10 example calculations', () => {
    const examples = generateExamples();
    assert.strictEqual(examples.length, 10);
  })) passed++; else failed++;

  if (test('generates valid examples with correct structure', () => {
    const examples = generateExamples();

    examples.forEach((example) => {
      assert.ok(example.hasOwnProperty('calculation'));
      assert.ok(example.hasOwnProperty('operands'));
      assert.ok(example.hasOwnProperty('sum'));
      assert.strictEqual(typeof example.calculation, 'string');
      assert.strictEqual(typeof example.operands, 'object');
      assert.strictEqual(typeof example.sum, 'number');
      assert.ok(example.operands.hasOwnProperty('digit1'));
      assert.ok(example.operands.hasOwnProperty('digit2'));
    });
  })) passed++; else failed++;

  if (test('generates examples with valid digits only', () => {
    const examples = generateExamples();

    examples.forEach((example) => {
      const { digit1, digit2 } = example.operands;
      assert.strictEqual(isValidDigit(digit1), true);
      assert.strictEqual(isValidDigit(digit2), true);
    });
  })) passed++; else failed++;

  if (test('generates examples with consistent calculations', () => {
    const examples = generateExamples();

    examples.forEach((example) => {
      const { digit1, digit2 } = example.operands;
      const expectedCalculation = `${digit1} + ${digit2} = ${digit1 + digit2}`;
      const expectedSum = digit1 + digit2;

      assert.strictEqual(example.calculation, expectedCalculation);
      assert.strictEqual(example.sum, expectedSum);
    });
  })) passed++; else failed++;

  if (test('includes edge case examples', () => {
    const examples = generateExamples();
    const sums = examples.map(e => e.sum);

    // Should include minimum sum (0+0=0) and maximum sum (9+9=18)
    assert.ok(sums.includes(0), 'Should include sum of 0');
    assert.ok(sums.includes(18), 'Should include sum of 18');
  })) passed++; else failed++;

  console.log('\nIntegration scenarios:');

  if (test('demonstrates complete workflow', () => {
    // Generate examples
    const examples = generateExamples();
    assert.ok(examples.length > 0);

    // Extract pairs for batch processing
    const pairs = examples.map(e => [e.operands.digit1, e.operands.digit2]);

    // Process in batch
    const batchResults = batchSumDigits(pairs);

    // All should succeed since examples use valid digits
    assert.ok(batchResults.every(r => r.success));

    // Results should match individual calculations
    batchResults.forEach((result, index) => {
      const [digit1, digit2] = pairs[index];
      const individual = sumDigits(digit1, digit2);
      assert.strictEqual(result.result, individual);
    });
  })) passed++; else failed++;

  if (test('handles error recovery in batch processing', () => {
    // Mix of valid and invalid pairs
    const mixedPairs = [
      [1, 2],    // valid
      [10, 3],   // invalid - first digit out of range
      [5, -1],   // invalid - second digit out of range
      [7, 8]     // valid
    ];

    const results = batchSumDigits(mixedPairs);

    // Should process all pairs despite errors
    assert.strictEqual(results.length, 4);

    // Valid pairs should succeed
    assert.strictEqual(results[0].success, true);
    assert.strictEqual(results[3].success, true);

    // Invalid pairs should fail gracefully
    assert.strictEqual(results[1].success, false);
    assert.strictEqual(results[2].success, false);

    // Error messages should be informative
    assert.ok(results[1].error.includes('single digits (0-9)'));
    assert.ok(results[2].error.includes('single digits (0-9)'));
  })) passed++; else failed++;

  // Summary
  const total = passed + failed;
  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${total}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests();
}