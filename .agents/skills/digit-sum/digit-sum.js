/**
 * Digit Sum Utility
 * A simple utility for adding two single digits with validation
 */

/**
 * Validates if a value is a single digit (0-9)
 * @param {number} value - The value to validate
 * @returns {boolean} - True if valid single digit, false otherwise
 */
function isValidDigit(value) {
  return Number.isInteger(value) && value >= 0 && value <= 9
}

/**
 * Sums two single digits and returns formatted result
 * @param {number} digit1 - First digit (0-9)
 * @param {number} digit2 - Second digit (0-9)
 * @returns {string} - Formatted result string "digit1 + digit2 = result"
 * @throws {Error} - If inputs are not valid single digits
 */
function sumDigits(digit1, digit2) {
  // Input validation
  if (!isValidDigit(digit1) || !isValidDigit(digit2)) {
    throw new Error('Both inputs must be single digits (0-9)')
  }

  // Calculate sum
  const result = digit1 + digit2

  // Return formatted result
  return `${digit1} + ${digit2} = ${result}`
}

/**
 * Interactive CLI function for digit sum calculator
 * Prompts user for input and displays result
 */
function startDigitSumCLI() {
  const readline = require('readline')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log('=================================')
  console.log('    Digit Sum Calculator')
  console.log('=================================')
  console.log('Enter two single digits (0-9) to add them together')
  console.log('')

  rl.question('Enter first digit: ', (input1) => {
    rl.question('Enter second digit: ', (input2) => {
      try {
        const digit1 = parseInt(input1.trim(), 10)
        const digit2 = parseInt(input2.trim(), 10)

        const result = sumDigits(digit1, digit2)
        console.log('')
        console.log('Result:', result)
        console.log('')
      } catch (error) {
        console.error('')
        console.error('Error:', error.message)
        console.error('')
      } finally {
        rl.close()
      }
    })
  })
}

/**
 * Batch process multiple digit pairs
 * @param {Array<[number, number]>} digitPairs - Array of digit pairs
 * @returns {Array<Object>} - Results with success/error for each pair
 */
function batchSumDigits(digitPairs) {
  return digitPairs.map(([digit1, digit2], index) => {
    try {
      const result = sumDigits(digit1, digit2)
      return {
        index,
        success: true,
        input: [digit1, digit2],
        result,
        sum: digit1 + digit2
      }
    } catch (error) {
      return {
        index,
        success: false,
        input: [digit1, digit2],
        error: error.message
      }
    }
  })
}

/**
 * Generate examples for educational purposes
 * @returns {Array<Object>} - Array of example calculations
 */
function generateExamples() {
  const examples = [
    [1, 2], [3, 4], [5, 6], [7, 8], [9, 0],
    [0, 0], [9, 9], [2, 7], [4, 5], [8, 1]
  ]

  return examples.map(([digit1, digit2]) => {
    const result = sumDigits(digit1, digit2)
    return {
      calculation: result,
      operands: { digit1, digit2 },
      sum: digit1 + digit2
    }
  })
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sumDigits,
    isValidDigit,
    startDigitSumCLI,
    batchSumDigits,
    generateExamples
  }
}

// CLI execution when run directly
if (require.main === module) {
  startDigitSumCLI()
}