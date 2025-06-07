# TS-Lib: Advanced Calculator Utility

[![npm version](https://badge.fury.io/js/ts-lib.svg)](https://badge.fury.io/js/ts-lib) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/lkd0x0is/ts-lib-template/LICENSE.md)

`ts-lib-example` is a TypeScript library providing an advanced calculator with features like precision control, chained operations, history tracking, and extensibility via custom operations. It serves as an example package within the [TypeScript Library Template](https://github.com/lkd0x0is/ts-lib-template).

## Features

* **Precision Control:** Set the number of decimal places for calculations.
* **Chained Operations:** Perform sequences of calculations on a current value.
* **Operations History:** Track all operations performed.
* **Extensible:** Register your own custom mathematical operations.
* **Strongly Typed:** Written in TypeScript for robust development.
* **Fully Documented:** Comprehensive API reference and usage guides.

## Installation

Install `ts-lib-example` using your preferred package manager:

**pnpm:**

```bash
pnpm add @lkd0x0is/ts-lib-example
````

**npm:**

```bash
npm install @lkd0x0is/ts-lib-example
```

**yarn:**

```bash
yarn add @lkd0x0is/ts-lib-example
```

## Basic Usage

Here's a quick example of how to use the `Calculator`:

```typescript
import { Calculator } from '@lkd0x0is/ts-lib-example'; // Or your actual package name

// Initialize with default precision (2) and initial value (0)
const calc = new Calculator();

// Set an initial value
calc.setValue(10); // Current value: 10.00

// Perform operations
calc.add(5.5);      // Current value: 15.50
calc.subtract(3.25);  // Current value: 12.25
calc.multiply(2);   // Current value: 24.50

console.log(`Result: ${calc.currentValue}`); // Output: Result: 24.50

// Access history
console.log('Calculation History:');
calc.history.forEach(entry => {
  console.log(
    `- ${entry.operationName} with [${entry.operands.join(', ')}] ` +
    `(Before: ${entry.valueBefore}, After: ${entry.valueAfter})`
  );
});
```

## Documentation

For detailed information, usage guides, and advanced topics, please refer to the full documentation website:

* **Guides & Tutorials:** [https://lkd0x0is.github.io/ts-lib-template/docs/](https://lkd0x0is.github.io/ts-lib-template/docs/)
*
* **API Reference:** [https://lkd0x0is.github.io/ts-lib-template/api/ts-lib](https://lkd0x0is.github.io/ts-lib-template/api/ts-lib)

## Contributing

This package is part of a larger monorepo. Contributions, issues, and feature requests are welcome\! Please refer to the [suspicious link removed] (if available) or open an issue in the [main repository](https://github.com/lkd0x0is/ts-lib-template).

## License

Licensed under the [MIT License](https://github.com/lkd0x0is/ts-lib-template/LICENSE.md)
