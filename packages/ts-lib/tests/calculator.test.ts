import { describe, expect, it } from "vitest";

import { Calculator } from "../src";

describe("Calculator E2E Tests / Scenarios", () => {
	it("Scenario 1: Basic chain of operations", () => {
		const calc = new Calculator({ initialValue: 0, precision: 2 });

		calc.setValue(10);
		expect(calc.currentValue).toBe(10);

		calc.add(5.5); // 10 + 5.5 = 15.50
		expect(calc.currentValue).toBe(15.5);

		calc.subtract(3.25); // 15.50 - 3.25 = 12.25
		expect(calc.currentValue).toBe(12.25);

		calc.multiply(2); // 12.25 * 2 = 24.50
		expect(calc.currentValue).toBe(24.5);

		calc.divide(4); // 24.50 / 4 = 6.125 -> 6.13
		expect(calc.currentValue).toBe(6.13);

		// Check history
		expect(calc.history.length).toBe(5); // setValue, add, subtract, multiply, divide
		expect(calc.history[0].operationName).toBe("setValue");
		expect(calc.history[1].operationName).toBe("add");
		expect(calc.history[1].operands).toEqual([10, 5.5]);
		expect(calc.history[1].valueAfter).toBe(15.5);
		expect(calc.history[4].operationName).toBe("divide");
		expect(calc.history[4].operands).toEqual([24.5, 4]);
		expect(calc.history[4].valueAfter).toBe(6.13);
	});

	it("Scenario 2: Precision changes affecting subsequent operations and history", () => {
		const calc = new Calculator({ initialValue: 0, precision: 3 });

		calc.setValue(100.123);
		expect(calc.currentValue).toBe(100.123);

		calc.add(0.0007); // 100.123 + 0.0007 = 100.1237 -> 100.124
		expect(calc.currentValue).toBe(100.124);

		calc.precision = 1; // Change precision
		calc.subtract(0.08); // Current value 100.124, 100.124 - 0.08 = 100.044. Rounded to 1 dec place -> 100.0
		expect(calc.currentValue).toBe(100.0);

		const history = calc.history;
		expect(history.length).toBe(3);
		expect(history[0].valueAfter).toBe(100.123); // setValue (initialValue rounded to 3 places)
		expect(history[1].valueAfter).toBe(100.124); // add (rounded to 3 places)
		expect(history[2].valueAfter).toBe(100.0); // subtract (rounded to 1 place)
	});

	it("Scenario 3: Using custom registered operations in a sequence", () => {
		const calc = new Calculator({ precision: 2 });
		calc.registerOperation("power", {
			symbol: "^",
			execute: (base, exponent) => base ** exponent,
		});
		calc.registerOperation("modulo", {
			symbol: "%",
			execute: (a, b) => a % b,
		});

		calc.setValue(3);
		calc.executeOperation("power", 3); // 3^3 = 27.00
		expect(calc.currentValue).toBe(27.0);

		calc.add(5); // 27.00 + 5 = 32.00
		expect(calc.currentValue).toBe(32.0);

		calc.executeOperation("modulo", 5); // 32 % 5 = 2.00
		expect(calc.currentValue).toBe(2.0);

		expect(calc.history.length).toBe(4); // setValue, power, add, modulo
		expect(calc.history[1].operationName).toBe("power");
		expect(calc.history[3].operationName).toBe("modulo");
	});

	it("Scenario 4: Operations after division by zero", () => {
		const calc = new Calculator({ initialValue: 10, precision: 2 });
		calc.divide(0); // currentValue is Infinity
		expect(calc.currentValue).toBe(Number.POSITIVE_INFINITY);

		// Operations with Infinity
		calc.add(5); // Infinity + 5 = Infinity
		expect(calc.currentValue).toBe(Number.POSITIVE_INFINITY);

		calc.multiply(2); // Infinity * 2 = Infinity
		expect(calc.currentValue).toBe(Number.POSITIVE_INFINITY);

		calc.multiply(0); // Infinity * 0 = NaN. Our _round handles NaN.
		expect(Number.isNaN(calc.currentValue)).toBe(true);

		// Resetting after NaN
		calc.setValue(100);
		expect(calc.currentValue).toBe(100.0);
		calc.add(1);
		expect(calc.currentValue).toBe(101.0);
	});

	it("Scenario 5: Clear and restart", () => {
		const calc = new Calculator({ initialValue: 50, precision: 1 });
		calc.add(10.12); // 50 + 10.12 = 60.12 -> 60.1
		expect(calc.currentValue).toBe(60.1);

		const historyBeforeClear = [...calc.history];
		const valueBeforeClear = calc.currentValue;

		calc.clear();
		expect(calc.currentValue).toBe(0);
		expect(calc.history.length).toBe(1); // Clear logs itself
		expect(calc.history[0].operationName).toBe("clear");
		expect(calc.history[0].valueBefore).toBe(valueBeforeClear);
		expect(calc.history[0].valueAfter).toBe(0);

		calc.add(5.5); // 0 + 5.5 = 5.5
		expect(calc.currentValue).toBe(5.5);
		expect(calc.history.length).toBe(2); // clear, add
		expect(calc.history[1].operationName).toBe("add");
	});
});
