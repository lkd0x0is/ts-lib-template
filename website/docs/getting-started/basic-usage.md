---
sidebar_label: Basic Usage
sidebar_position: 2
title: Basic Usage
---

# Basic Usage

This guide will walk you through the initial steps of using the `Calculator` from `ts-lib`.

## Importing the Calculator

First, import the `Calculator` class into your TypeScript file:

```typescript title="my-script.ts"
import { Calculator } from 'ts-lib'; // Use actual package name
```

## Creating an Instance

You can create a new `Calculator` instance with default settings (precision 2, initial value 0) or provide custom options:

```typescript
// Default calculator
const calc = new Calculator();

// Calculator with custom precision and initial value
const customCalc = new Calculator({ precision: 3, initialValue: 100 });
```

## Performing Operations

The calculator maintains a `currentValue`. Most operations modify this value.

```typescript
import { Calculator } from 'ts-lib';

const calc = new Calculator(); // Starts with currentValue = 0, precision = 2

// Set an initial value
calc.setValue(10);
console.log(calc.currentValue); // Output: 10.00

// Perform addition
calc.add(5.5); // currentValue = 10.00 + 5.5 = 15.50
console.log(calc.currentValue); // Output: 15.50

// Perform subtraction
calc.subtract(3.25); // currentValue = 15.50 - 3.25 = 12.25
console.log(calc.currentValue); // Output: 12.25
```

## Accessing Results and History

You can always get the current result using the `currentValue` getter and review the sequence of operations using the `history` getter.

```typescript
// ... continuing from above
console.log(`Final Value: ${calc.currentValue}`); // Final Value: 12.25

console.log('Operations History:');
calc.history.forEach(entry => {
  console.log(
    `${entry.operationName}: ${entry.operands.join(', ')} (Before: ${entry.valueBefore}, After: ${entry.valueAfter})`
  );
});
// Example Output:
// Operations History:
// setValue: 10 (Before: 0, After: 10)
// add: 10, 5.5 (Before: 10, After: 15.5)
// subtract: 15.5, 3.25 (Before: 15.5, After: 12.25)
```

This covers the basics! Explore other guides to learn about precision control, history management, and custom operations.
