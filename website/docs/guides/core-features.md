---
sidebar_label: Core Features
sidebar_position: 1
title: Understanding Core Features
---

# Understanding Core Features

The `ts-lib` Calculator offers several core features designed for flexibility and traceability.

## Current Value and Chained Operations

The `Calculator` instance maintains an internal `currentValue`. Most arithmetic operations (`add`, `subtract`, `multiply`, `divide`) act upon this `currentValue` using the provided operand and then update `currentValue` with the result.

This allows for easy chaining of operations:

```typescript
import { Calculator } from 'ts-lib';

const calc = new Calculator({ precision: 2 });

calc.setValue(100); // Sets currentValue to 100.00
calc.add(50);       // currentValue = 100.00 + 50 = 150.00
calc.subtract(25.5); // currentValue = 150.00 - 25.5 = 124.50
calc.multiply(2);   // currentValue = 124.50 * 2 = 249.00
calc.divide(10);    // currentValue = 249.00 / 10 = 24.90

console.log(calc.currentValue); // Output: 24.90

## Precision Management

Precision determines how many decimal places are kept after rounding the result of each operation.

* **Default Precision:** 2 decimal places.
* **Setting Precision:** You can set precision during instantiation or at any time using the `precision` property.

    ```typescript
    const calc = new Calculator({ precision: 4 }); // Precision is 4
    calc.precision = 1; // Precision is now 1
    ```

* **Behavior:** Precision must be a non-negative integer. If a float is provided, it will be floored. Setting a negative precision will throw an error.

```typescript
const calc = new Calculator({ initialValue: 10, precision: 3 });
calc.divide(3); // 10 / 3 = 3.33333... rounded to 3 places is 3.333
console.log(calc.currentValue); // Output: 3.333

calc.precision = 0;
calc.divide(2); // currentValue was 3.333. 3.333 / 2 = 1.6665. Rounded to 0 places is 2.
console.log(calc.currentValue); // Output: 2
```

:::caution
Changing precision affects how subsequent results are rounded and stored.
:::

## Operations History

Every significant action that changes the calculator's state is logged in the `history` array. Each entry provides details about the operation.

```typescript
import { Calculator, type HistoryEntry } from 'ts-lib';

const calc = new Calculator({ precision: 1 });
calc.setValue(5);
calc.add(2.75);    // 5 + 2.75 = 7.75, rounded to 7.8
calc.multiply(2); // 7.8 * 2 = 15.6

calc.history.forEach((entry: HistoryEntry) => {
  console.log(
    `Operation: ${entry.operationName}, Operands: [${entry.operands.join(', ')}], ` +
    `Value Before: ${entry.valueBefore}, Value After: ${entry.valueAfter}`
  );
});
// Expected Output:
// Operation: setValue, Operands: [5], Value Before: 0, Value After: 5
// Operation: add, Operands: [5, 2.75], Value Before: 5, Value After: 7.8
// Operation: multiply, Operands: [7.8, 2], Value Before: 7.8, Value After: 15.6
```

The `history` is an array of `HistoryEntry` objects. It's a read-only copy, so external modifications won't affect the calculator's internal history.

## `setValue()` and `clear()`

* **`setValue(newValue: number)`:** Directly sets the `currentValue` to `newValue` (after rounding `newValue` to the current precision). This action also **clears the entire history** and logs itself as the new first entry.

    ```typescript
    calc.setValue(123.456); // If precision is 2, currentValue becomes 123.46
                            // History is now just [{ operationName: 'setValue', ... }]
    ```

* **`clear()`:** Resets the `currentValue` to `0` and **clears the entire history**. This action is also logged as the new first entry.

    ```typescript
    calc.add(10); // currentValue is not 0
    calc.clear();   // currentValue is now 0
                    // History is now just [{ operationName: 'clear', ... }]
    ```

These methods are useful for starting new calculation sequences or resetting the calculator state.
