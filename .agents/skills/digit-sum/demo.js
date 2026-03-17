#!/usr/bin/env node

/**
 * Demonstration script for the digit-sum skill
 * Shows various use cases and capabilities
 */

const {
  sumDigits,
  isValidDigit,
  batchSumDigits,
  generateExamples
} = require('./digit-sum')

console.log('🧮 Digit Sum Skill Demonstration')
console.log('=================================\n')

// 1. Basic usage examples
console.log('1. Basic Usage Examples:')
console.log('------------------------')
try {
  console.log(sumDigits(3, 5))
  console.log(sumDigits(9, 1))
  console.log(sumDigits(0, 8))
  console.log(sumDigits(7, 7))
} catch (error) {
  console.error('Error:', error.message)
}
console.log('')

// 2. Edge cases
console.log('2. Edge Cases:')
console.log('--------------')
console.log(sumDigits(0, 0))    // minimum
console.log(sumDigits(9, 9))    // maximum
console.log(sumDigits(1, 9))    // results in 10
console.log('')

// 3. Input validation demonstration
console.log('3. Input Validation:')
console.log('-------------------')
const testCases = [
  [5, 3],      // valid
  [-1, 5],     // invalid: negative
  [10, 2],     // invalid: > 9
  [3.5, 4],    // invalid: decimal
  ['5', 3],    // invalid: string
]

testCases.forEach(([a, b]) => {
  try {
    const result = sumDigits(a, b)
    console.log(`✅ ${result}`)
  } catch (error) {
    console.log(`❌ sumDigits(${a}, ${b}) -> ${error.message}`)
  }
})
console.log('')

// 4. Batch processing
console.log('4. Batch Processing:')
console.log('-------------------')
const digitPairs = [
  [1, 2],
  [4, 5],
  [8, 9],
  [10, 3],  // invalid pair
  [6, 0]
]

const batchResults = batchSumDigits(digitPairs)
batchResults.forEach((result) => {
  if (result.success) {
    console.log(`✅ Pair ${result.index}: ${result.result}`)
  } else {
    console.log(`❌ Pair ${result.index}: ${result.error}`)
  }
})
console.log('')

// 5. Educational examples
console.log('5. Educational Examples:')
console.log('-----------------------')
const examples = generateExamples()
examples.slice(0, 5).forEach((example, index) => {
  console.log(`Example ${index + 1}: ${example.calculation}`)
})
console.log(`... and ${examples.length - 5} more examples`)
console.log('')

// 6. Validation function demonstration
console.log('6. Digit Validation:')
console.log('-------------------')
const validationTests = [-1, 0, 5, 9, 10, 3.5, 'a', null]
validationTests.forEach((value) => {
  const isValid = isValidDigit(value)
  console.log(`isValidDigit(${JSON.stringify(value)}) -> ${isValid ? '✅' : '❌'}`)
})
console.log('')

// 7. Performance test
console.log('7. Performance Test:')
console.log('-------------------')
console.time('1000 calculations')
for (let i = 0; i < 1000; i++) {
  const digit1 = Math.floor(Math.random() * 10)
  const digit2 = Math.floor(Math.random() * 10)
  sumDigits(digit1, digit2)
}
console.timeEnd('1000 calculations')
console.log('')

// 8. Summary statistics
console.log('8. Summary:')
console.log('----------')
console.log(`• Generated ${examples.length} educational examples`)
console.log(`• Processed ${batchResults.length} batch calculations`)
console.log(`• Success rate: ${batchResults.filter(r => r.success).length}/${batchResults.length}`)
console.log(`• Minimum possible sum: 0 (0 + 0)`)
console.log(`• Maximum possible sum: 18 (9 + 9)`)
console.log(`• Input validation: strict single digits (0-9) only`)
console.log('')

console.log('🎉 Demonstration complete!')
console.log('Run with: node demo.js')