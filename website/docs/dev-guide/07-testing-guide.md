---
id: testing-guide
title: Testing Guide
sidebar_label: Testing Guide
slug: /dev-guide/testing-guide
---

Comprehensive testing is vital for maintaining code quality, preventing regressions, and ensuring the reliability of your libraries. This guide outlines the testing strategies, conventions, and tools used in this template, primarily focusing on [Vitest](https://vitest.dev/).

## Testing Philosophy

* **Test Early, Test Often:** Write tests alongside your code, not as an afterthought.
* **Focus on Value:** Prioritize tests that provide the most confidence in your code's correctness and stability.
* **Isolation (for Unit Tests):** Unit tests should verify small, isolated pieces of code (functions, classes) without external dependencies.
* **Integration (for E2E/Integration Tests):** Test how different parts of your library (or the library with external systems, if applicable) work together.
* **Readability and Maintainability:** Tests are also documentation. Write clear, concise, and maintainable tests.
* **Automation:** All tests should be runnable via a single command and integrated into the CI/CD pipeline.

## Types of Tests

This template primarily focuses on two types of automated tests:

### 1. Unit Tests

* **Purpose:** To verify the correctness of individual, isolated units of code (e.g., functions, methods, components).
* **Characteristics:**
  * Small, focused, and fast.
  * Dependencies are typically mocked or stubbed.
  * Should not involve network requests, file system access (unless that's what the unit specifically does and can be controlled), or other external services.
* **Location:**
  * **Co-location (Recommended):** Place unit test files directly next to the source files they are testing, within the `src/` directory. Use a naming convention like `*.test.ts` or `*.spec.ts`.
    * Example: `packages/<your-package>/src/myModule.ts` and `packages/<your-package>/src/myModule.unit.test.ts`.
  * **Alternative (`__tests__` directory):** Some prefer to group tests in a `__tests__` subdirectory within `src/`, like `packages/<your-package>/src/__tests__/myModule.test.ts`.
* **Tooling:** Vitest is used for running unit tests.

### 2. Integration / End-to-End (E2E) Tests

* **Purpose:** To verify that different parts of your library (or the entire library) work together correctly. For libraries, this might mean testing the public API as a whole. For applications built upon these libraries, E2E tests would simulate user scenarios.
* **Characteristics:**
  * Test larger pieces of functionality.
  * May involve multiple modules or classes interacting.
  * Can be slower than unit tests.
  * Should minimize mocking where possible to test real integrations.
* **Location:**
  * Typically placed in a dedicated `test/` directory at the root of each package: `packages/<your-package>/test/`.
  * Use a naming convention like `*.integration.test.ts` or `*.e2e.test.ts`.
    * Example: `packages/<your-package>/test/publicApi.integration.test.ts`.
* **Tooling:** Vitest can also be used for integration tests. For more complex E2E scenarios involving browsers (if your libraries are UI-related), tools like Playwright or Cypress might be considered but are not pre-configured in this template.

## Writing Tests with Vitest

Vitest offers a Jest-compatible API, making it familiar to many developers.

* **Basic Structure:**

    ```typescript
    // packages/my-lib/src/calculator.unit.test.ts
    import { describe, it, expect, vi } from 'vitest';
    import { add } from './calculator'; // Assuming add is in calculator.ts

    describe('Calculator: add function', () => {
      it('should return the sum of two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
      });

      it('should return a negative number if one input is negative', () => {
        expect(add(5, -2)).toBe(3);
      });

      // More tests...
    });
    ```

* **Key Vitest Features:**
  * **`describe` blocks:** Group related tests.
  * **`it` or `test` blocks:** Define individual test cases.
  * **`expect` assertions:** Check if values meet certain conditions (e.g., `toBe`, `toEqual`, `toHaveBeenCalled`).
  * **Mocking & Spying (`vi`):**
    * `vi.fn()`: Creates a mock function.
    * `vi.spyOn()`: Spies on an existing object's method.
    * `vi.mock('./path/to/module', () => ({ ... }))`: Mocks an entire module.
        Refer to [Vitest Mocking Guide](https://vitest.dev/guide/mocking.html) for details.
  * **Setup & Teardown:** `beforeEach`, `afterEach`, `beforeAll`, `afterAll` for setting up preconditions and cleaning up after tests.
  * **Async Tests:** Vitest handles Promises and `async/await` seamlessly.
  * **Snapshot Testing:** Useful for testing UI components or large object structures. (Use with caution, ensure snapshots are meaningful).

## Running Tests

Scripts for running tests are defined in the root `package.json` and typically also in each individual package's `package.json`.

### From the Monorepo Root

* **Run all tests for all packages:**

    ```bash
    pnpm test
    # or
    pnpm test:all
    ```

* **Run all tests in watch mode:**

    ```bash
    pnpm test:watch
    # or
    pnpm test:watch:all
    ```

    Vitest's watch mode is interactive and will re-run tests on file changes.

* **Run tests for a specific package:**

    ```bash
    pnpm --filter <package-name> test
    # Example:
    pnpm --filter my-lib test
    ```

* **Run tests for a specific package in watch mode:**

    ```bash
    pnpm --filter <package-name> test:watch
    # Example:
    pnpm --filter my-lib test:watch
    ```

### Within a Specific Package

If you are inside a package directory (`cd packages/<package-name>`):

* **Run tests for the current package:**

    ```bash
    pnpm test
    ```

* **Run tests for the current package in watch mode:**

    ```bash
    pnpm test:watch
    ```

### Test Coverage

* **Generating Coverage Reports:** Vitest can generate code coverage reports using `c8` or `istanbul`. This is usually configured in `vite.config.ts` or via CLI flags.
  * A typical script might be: `pnpm test --coverage`
* **Configuration:**

    ```typescript
    // packages/my-lib/vite.config.ts
    import { defineConfig } from 'vitest/config';

    export default defineConfig({
      test: {
        globals: true, // Optional: use Vitest globals without importing
        environment: 'node', // Or 'jsdom' for browser-like environment
        coverage: {
          provider: 'v8', // or 'istanbul'
          reporter: ['text', 'json', 'html', 'lcov'],
          reportsDirectory: './coverage',
          all: true, // Include all files in src, not just tested ones
          include: ['src/**/*.{ts,tsx}'],
          exclude: [
            // Add patterns to exclude from coverage
            'src/types.ts',
            'src/**/index.ts', // Often barrel files don't need coverage
          ],
        },
      },
    });
    ```

* **Viewing Reports:** HTML reports are typically generated in a `coverage/` directory within each package.

## CI Integration

Tests are a critical part of the CI pipeline (`.github/workflows/ci-checks.yml`). The workflow typically runs `pnpm test` to ensure all tests pass before code can be merged or released.

## Best Practices for Testing

* **Descriptive Test Names:** `describe` and `it` blocks should clearly state what is being tested and the expected outcome.
* **AAA Pattern (Arrange, Act, Assert):**
  * **Arrange:** Set up the necessary preconditions and inputs.
  * **Act:** Execute the code being tested.
  * **Assert:** Verify that the outcome is as expected.
* **Test One Thing at a Time:** Each `it` block should ideally test a single piece of logic or behavior.
* **Avoid Logic in Tests:** Keep test logic simple. Complex logic in tests can introduce its own bugs.
* **Independent Tests:** Tests should not depend on each other or the order in which they are run. Use `beforeEach` and `afterEach` for proper setup and teardown.
* **Mock Effectively:** When unit testing, mock external dependencies to isolate the unit under test. However, avoid over-mocking, which can make tests brittle or less meaningful.
* **Update Tests with Code:** When you refactor or change code, update the corresponding tests immediately. Outdated tests are worse than no tests.

By following these guidelines, you can build a robust test suite that provides confidence in your codebase and supports agile development.
