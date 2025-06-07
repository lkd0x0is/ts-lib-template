# TS-Lib: Advanced Calculator Utility

[![npm version](https://badge.fury.io/js/ts-lib.svg)](https://badge.fury.io/js/ts-lib) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE.md)

`ts-lib` is a TypeScript library providing an advanced calculator with features like precision control, chained operations, history tracking, and extensibility via custom operations. It serves as an example package within the [TypeScript Library Monorepo Template](https://github.com/<test-github-username>/<repo-name>).

## Features

* **Precision Control:** Set the number of decimal places for calculations.
* **Chained Operations:** Perform sequences of calculations on a current value.
* **Operations History:** Track all operations performed.
* **Extensible:** Register your own custom mathematical operations.
* **Strongly Typed:** Written in TypeScript for robust development.
* **Fully Documented:** Comprehensive API reference and usage guides.

## Installation

Install `ts-lib` using your preferred package manager:

**pnpm:**

```bash
pnpm add ts-lib
````

**npm:**

```bash
npm install ts-lib
```

**yarn:**

```bash
yarn add ts-lib
```

## Basic Usage

Here's a quick example of how to use the `Calculator`:

```typescript
import { Calculator } from 'ts-lib'; // Or your actual package name

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

* **Guides & Tutorials:** [https://\<test-github-username\>.github.io/\<repo-name\>/docs/](https://www.google.com/search?q=https://%3Ctest-github-username%3E.github.io/%3Crepo-name%3E/docs/)
* **API Reference:** [https://\<test-github-username\>.github.io/\<repo-name\>/api/](https://www.google.com/search?q=https://%3Ctest-github-username%3E.github.io/%3Crepo-name%3E/api/)

*(Replace `<test-github-username>` and `<repo-name>` with your actual GitHub details where the documentation is hosted.)*

## Contributing

This package is part of a larger monorepo. Contributions, issues, and feature requests are welcome\! Please refer to the [suspicious link removed] (if available) or open an issue in the [main repository](https://www.google.com/search?q=https://github.com/%3Ctest-github-username%3E/%3Crepo-name%3E).

## License

Licensed under the [MIT License](LICENSE.md)..
