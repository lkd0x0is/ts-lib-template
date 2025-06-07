---

sidebar_label: Custom Operations
sidebar_position: 2
title: Extending with Custom Operations
---

# Extending with Custom Operations

The `ts-lib` Calculator is extensible, allowing you to define and register your own custom arithmetic or mathematical operations.

## The `Operation` and `NamedOperation` Interfaces

To define a custom operation, you need an object that conforms to the `Operation` (or `NamedOperation`) interface:

```typescript
export interface Operation {
  execute: (currentValue: number, operand: number) => number;
  symbol: string;
}

export interface NamedOperation extends Operation {
  name: string;
}
```

* `name`: A unique string identifier for your operation.
* `symbol`: A string symbol (e.g., `^`, `mod`) used primarily for display or logging.
* `execute`: A function that takes two numbers (`currentValue` from the calculator, and an `operand` you provide when calling the operation) and returns the result. The calculator will automatically round this result based on its current precision.

## Registering a Custom Operation

Use the `registerOperation(name: string, operation: Omit<NamedOperation, 'name'>)` method:

```typescript
import { Calculator, type Operation, type NamedOperation } from 'ts-lib';

const calc = new Calculator();

// Define a "power" operation
const powerOperation: Omit<NamedOperation, 'name'> = {
  symbol: '^',
  execute: (base, exponent) => Math.pow(base, exponent),
};
calc.registerOperation('power', powerOperation);

// Define a "modulo" operation
calc.registerOperation('modulo', {
  symbol: '%',
  execute: (a, b) => {
    if (b === 0) throw new Error("Cannot perform modulo with zero divisor.");
    return a % b;
  },
});
```

If you try to register an operation with a name that already exists (like 'add'), it will throw an error.

## Using Custom Operations

Once registered, you can use custom operations via the `executeOperation(operationName: string, operand: number)` method:

```typescript
// ... calculator instance with 'power' and 'modulo' registered

calc.setValue(5); // Current value: 5

calc.executeOperation('power', 3); // 5 ^ 3 = 125
console.log(calc.currentValue);   // Output: 125.00 (assuming precision 2)

calc.executeOperation('modulo', 10); // 125 % 10 = 5
console.log(calc.currentValue);    // Output: 5.00
```

Custom operations are logged in the `history` just like built-in ones.

### Example: Square Root Operation

Since our `execute` signature expects `(currentValue, operand)`, a unary operation like square root might seem tricky. You can design it so the `operand` is ignored, or make the `currentValue` the target.

```typescript
// operand is ignored, operation applies to currentValue
calc.registerOperation('sqrt', {
  symbol: '√',
  execute: (currentVal, _operand) => { // operand is unused for sqrt
    if (currentVal < 0) throw new Error("Cannot calculate square root of a negative number.");
    return Math.sqrt(currentVal);
  }
});

calc.setValue(16);
calc.executeOperation('sqrt', 0); // Operand 0 is a dummy, not used by sqrt.execute
console.log(calc.currentValue); // Output: 4.00
```

This extensibility allows you to tailor the calculator to specific mathematical needs beyond its default set of operations.
