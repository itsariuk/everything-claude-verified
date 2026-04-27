---
name: digit-sum
description: A mathematical utility skill that sums two single digits and prints the results. Useful for basic arithmetic operations and educational purposes.
origin: ECC
---

# Digit Sum Skill

This skill provides a simple utility to sum two single digits (0-9) and display the result. It's designed for basic mathematical operations and educational demonstrations.

## When to Activate

- When you need to perform basic addition of two single digits
- During mathematical demonstrations or tutorials
- For simple calculator functionality
- When teaching basic arithmetic concepts
- For testing mathematical operations in code

## Core Functionality

### Primary Operation
- **Input**: Two single digits (0-9)
- **Output**: Sum of the digits with formatted display
- **Validation**: Ensures inputs are valid single digits
- **Error Handling**: Graceful handling of invalid inputs

## How It Works

### Step 1: Input Validation
Validates that both inputs are single digits (0-9):
- Numbers must be integers
- Must be in range 0-9
- No decimal places allowed
- No negative numbers

### Step 2: Calculation
Performs simple addition:
```
result = digit1 + digit2
```

### Step 3: Result Display
Formats and displays the result:
```
{digit1} + {digit2} = {result}
```

## Implementation Patterns

### Basic Usage Pattern
```typescript
function sumDigits(digit1: number, digit2: number): string {
  // Validation
  if (!isValidDigit(digit1) || !isValidDigit(digit2)) {
    throw new Error('Both inputs must be single digits (0-9)')
  }

  // Calculation
  const result = digit1 + digit2

  // Formatted output
  return `${digit1} + ${digit2} = ${result}`
}

function isValidDigit(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 9
}
```

### Interactive CLI Pattern
```typescript
import { createInterface } from 'readline'

function startDigitSumCLI() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log('Digit Sum Calculator')
  console.log('Enter two single digits (0-9) to add them together')

  rl.question('Enter first digit: ', (input1) => {
    rl.question('Enter second digit: ', (input2) => {
      try {
        const digit1 = parseInt(input1.trim())
        const digit2 = parseInt(input2.trim())
        const result = sumDigits(digit1, digit2)
        console.log(result)
      } catch (error) {
        console.error(`Error: ${error.message}`)
      } finally {
        rl.close()
      }
    })
  })
}
```

### Web API Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const digit1Str = searchParams.get('digit1')
  const digit2Str = searchParams.get('digit2')

  if (!digit1Str || !digit2Str) {
    return NextResponse.json(
      { error: 'Missing digit1 or digit2 parameters' },
      { status: 400 }
    )
  }

  try {
    const digit1 = parseInt(digit1Str)
    const digit2 = parseInt(digit2Str)
    const result = sumDigits(digit1, digit2)

    return NextResponse.json({
      success: true,
      calculation: result,
      operands: { digit1, digit2 },
      sum: digit1 + digit2
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
```

## Testing Patterns

### Unit Tests
```typescript
import { sumDigits, isValidDigit } from './digit-sum'

describe('sumDigits', () => {
  it('adds two single digits correctly', () => {
    expect(sumDigits(3, 5)).toBe('3 + 5 = 8')
    expect(sumDigits(0, 9)).toBe('0 + 9 = 9')
    expect(sumDigits(7, 2)).toBe('7 + 2 = 9')
  })

  it('handles edge cases', () => {
    expect(sumDigits(0, 0)).toBe('0 + 0 = 0')
    expect(sumDigits(9, 9)).toBe('9 + 9 = 18')
  })

  it('throws error for invalid inputs', () => {
    expect(() => sumDigits(-1, 5)).toThrow('Both inputs must be single digits (0-9)')
    expect(() => sumDigits(10, 3)).toThrow('Both inputs must be single digits (0-9)')
    expect(() => sumDigits(3.5, 4)).toThrow('Both inputs must be single digits (0-9)')
  })
})

describe('isValidDigit', () => {
  it('validates single digits correctly', () => {
    expect(isValidDigit(0)).toBe(true)
    expect(isValidDigit(5)).toBe(true)
    expect(isValidDigit(9)).toBe(true)
  })

  it('rejects invalid inputs', () => {
    expect(isValidDigit(-1)).toBe(false)
    expect(isValidDigit(10)).toBe(false)
    expect(isValidDigit(3.5)).toBe(false)
    expect(isValidDigit(NaN)).toBe(false)
  })
})
```

### Integration Tests
```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/digit-sum', () => {
  it('returns sum for valid digits', async () => {
    const request = new NextRequest('http://localhost/api/digit-sum?digit1=4&digit2=6')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.calculation).toBe('4 + 6 = 10')
    expect(data.sum).toBe(10)
  })

  it('returns error for missing parameters', async () => {
    const request = new NextRequest('http://localhost/api/digit-sum?digit1=5')
    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Missing digit1 or digit2 parameters'
    })
  })

  it('returns error for invalid digits', async () => {
    const request = new NextRequest('http://localhost/api/digit-sum?digit1=10&digit2=5')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })
})
```

## Example Use Cases

### Educational Tool
```typescript
// Teaching addition to students
const examples = [
  { a: 1, b: 2, expected: 3 },
  { a: 4, b: 5, expected: 9 },
  { a: 8, b: 7, expected: 15 }
]

examples.forEach(({ a, b, expected }) => {
  const result = sumDigits(a, b)
  console.log(`Example: ${result}`)
  console.log(`Expected: ${a} + ${b} = ${expected}`)
  console.log('---')
})
```

### Calculator Component
```typescript
import React, { useState } from 'react'

export function DigitSumCalculator() {
  const [digit1, setDigit1] = useState('')
  const [digit2, setDigit2] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleCalculate = () => {
    try {
      const d1 = parseInt(digit1)
      const d2 = parseInt(digit2)
      const calculation = sumDigits(d1, d2)
      setResult(calculation)
      setError('')
    } catch (err) {
      setError(err.message)
      setResult('')
    }
  }

  return (
    <div className="digit-sum-calculator">
      <h2>Digit Sum Calculator</h2>
      <input
        type="number"
        min="0"
        max="9"
        value={digit1}
        onChange={(e) => setDigit1(e.target.value)}
        placeholder="First digit (0-9)"
      />
      <span>+</span>
      <input
        type="number"
        min="0"
        max="9"
        value={digit2}
        onChange={(e) => setDigit2(e.target.value)}
        placeholder="Second digit (0-9)"
      />
      <button onClick={handleCalculate}>Calculate</button>

      {result && <div className="result">{result}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

## Error Handling

### Common Error Scenarios
- **Non-numeric input**: "Input must be a number"
- **Out of range**: "Both inputs must be single digits (0-9)"
- **Decimal numbers**: "Decimal numbers not allowed, use integers only"
- **Negative numbers**: "Negative numbers not allowed"

### Error Response Format
```typescript
interface ErrorResponse {
  error: string
  code: 'INVALID_INPUT' | 'OUT_OF_RANGE' | 'MISSING_PARAMETER'
  received?: {
    digit1?: any
    digit2?: any
  }
}
```

## Performance Considerations

- **Lightweight**: Simple arithmetic operation with O(1) complexity
- **No dependencies**: Uses only built-in JavaScript functions
- **Memory efficient**: Minimal memory footprint
- **Fast execution**: Sub-millisecond calculation time

## Extensibility

### Potential Enhancements
- Support for multiple digits addition
- Batch processing of digit pairs
- History of calculations
- Export results to file
- Support for different number bases

### Plugin Architecture
```typescript
interface DigitSumPlugin {
  name: string
  transform?: (digit1: number, digit2: number) => [number, number]
  format?: (result: string) => string
  validate?: (digit1: number, digit2: number) => boolean
}
```

## Best Practices

1. **Input Validation**: Always validate inputs before calculation
2. **Error Messages**: Provide clear, helpful error messages
3. **Type Safety**: Use TypeScript for better type checking
4. **Testing**: Comprehensive unit and integration tests
5. **Documentation**: Clear function documentation with examples
6. **Accessibility**: Support screen readers and keyboard navigation
7. **Internationalization**: Consider different number formatting conventions

## Success Metrics

- **Accuracy**: 100% correct calculations for valid inputs
- **Error Handling**: Graceful handling of all invalid inputs
- **Performance**: < 1ms execution time for single operation
- **Usability**: Intuitive interface with clear feedback
- **Testability**: > 95% code coverage with comprehensive tests

---

**Remember**: This skill serves as a foundation for more complex mathematical operations and demonstrates proper input validation, error handling, and testing patterns.