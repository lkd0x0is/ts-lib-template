import { beforeEach, describe, expect, it } from "vitest";
import { Calculator, type NamedOperation } from "./calculator";

describe("Calculator Unit Tests", () => {
	let calculator: Calculator;

	beforeEach(() => {
		calculator = new Calculator(); // Default precision 2, initialValue 0
	});

	describe("Constructor", () => {
		it("should initialize with default precision 2 and value 0", () => {
			expect(calculator.precision).toBe(2);
			expect(calculator.currentValue).toBe(0);
			expect(calculator.history).toEqual([]); // History is empty before setValue/clear logs
		});

		it("should initialize with specified precision and initial value", () => {
			const calc = new Calculator({ precision: 3, initialValue: 10 });
			expect(calc.precision).toBe(3);
			expect(calc.currentValue).toBe(10);
		});

		it("should floor precision if provided as float", () => {
			const calc = new Calculator({ precision: 3.7 });
			expect(calc.precision).toBe(3);
		});

		it("should set precision to 0 if negative precision is provided in constructor", () => {
			const calc = new Calculator({ precision: -5 });
			expect(calc.precision).toBe(0);
		});
	});

	describe("Precision Handling", () => {
		it("should get current precision", () => {
			calculator.precision = 4;
			expect(calculator.precision).toBe(4);
		});

		it("should set valid precision", () => {
			calculator.precision = 0;
			expect(calculator.precision).toBe(0);
			calculator.precision = 5;
			expect(calculator.precision).toBe(5);
		});

		it("should throw error for negative precision", () => {
			expect(() => {
				calculator.precision = -1;
			}).toThrow("Precision cannot be negative.");
		});

		it("should floor precision value when setting", () => {
			calculator.precision = 3.99;
			expect(calculator.precision).toBe(3);
		});
	});

	describe("setValue()", () => {
		it("should set the current value and round it", () => {
			calculator.precision = 1;
			calculator.setValue(10.75);
			expect(calculator.currentValue).toBe(10.8);
		});

		it("should clear history and log setValue operation", () => {
			calculator.add(5); // Add something to history
			calculator.setValue(20);
			expect(calculator.currentValue).toBe(20);
			expect(calculator.history.length).toBe(1);
			expect(calculator.history[0].operationName).toBe("setValue");
			expect(calculator.history[0].valueAfter).toBe(20);
		});
	});

	describe("clear()", () => {
		it("should reset currentValue to 0 and clear history", () => {
			calculator.setValue(100);
			calculator.add(5);
			const valueBeforeClear = calculator.currentValue;
			calculator.clear();
			expect(calculator.currentValue).toBe(0);
			expect(calculator.history.length).toBe(1); // Clear logs itself
			expect(calculator.history[0].operationName).toBe("clear");
			expect(calculator.history[0].valueBefore).toBe(valueBeforeClear);
			expect(calculator.history[0].valueAfter).toBe(0);
		});
	});

	describe("Arithmetic Method Units (direct operation logic, isolated from history/currentValue where possible for some checks)", () => {
		// For these, we'll test the underlying registered operations' execute functions
		// or how _performOperation works with them.
		// The Calculator's public methods (add, subtract) now directly use _performOperation
		// which updates currentValue and history. So pure unit tests of "just calculation"
		// become harder without testing state changes. We'll focus on state changes.

		it("add() should update currentValue and history", () => {
			calculator.setValue(10); // history: [setValue]
			calculator.add(5.128); // currentValue = 10 + 5.128 = 15.128, rounded to 15.13
			// history: [setValue, add]
			expect(calculator.currentValue).toBe(15.13);
			expect(calculator.history.length).toBe(2);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("add");
			expect(lastOp.operands).toEqual([10, 5.128]);
			expect(lastOp.valueBefore).toBe(10);
			expect(lastOp.valueAfter).toBe(15.13);
		});

		it("subtract() should update currentValue and history", () => {
			calculator.setValue(20.5);
			calculator.subtract(5.25); // 20.5 - 5.25 = 15.25
			expect(calculator.currentValue).toBe(15.25);
			expect(calculator.history.length).toBe(2);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("subtract");
			expect(lastOp.operands).toEqual([20.5, 5.25]);
			expect(lastOp.valueAfter).toBe(15.25);
		});

		it("multiply() should update currentValue and history", () => {
			calculator.setValue(6);
			calculator.precision = 2;
			calculator.multiply(3.333); // 6 * 3.333 = 19.998 -> 20.00
			expect(calculator.currentValue).toBe(20.0);
			expect(calculator.history.length).toBe(2);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("multiply");
			expect(lastOp.operands).toEqual([6, 3.333]);
			expect(lastOp.valueAfter).toBe(20.0);
		});

		it("divide() should update currentValue and history", () => {
			calculator.setValue(10);
			calculator.precision = 2;
			calculator.divide(3); // 10 / 3 = 3.333... -> 3.33
			expect(calculator.currentValue).toBe(3.33);
			expect(calculator.history.length).toBe(2);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("divide");
			expect(lastOp.operands).toEqual([10, 3]);
			expect(lastOp.valueAfter).toBe(3.33);
		});

		it("divide() by zero should return Infinity and log correctly", () => {
			calculator.setValue(10);
			calculator.divide(0);
			expect(calculator.currentValue).toBe(Number.POSITIVE_INFINITY);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("divide");
			expect(lastOp.operands).toEqual([10, 0]);
			expect(lastOp.valueAfter).toBe(Number.POSITIVE_INFINITY);
		});

		it("divide() negative number by zero should return Negative Infinity", () => {
			calculator.setValue(-10);
			calculator.divide(0);
			expect(calculator.currentValue).toBe(Number.NEGATIVE_INFINITY);
		});
	});

	describe("registerOperation() and executeOperation()", () => {
		it("should register a new operation", () => {
			const powerOp: Omit<NamedOperation, "name"> = {
				symbol: "^",
				execute: (base, exponent) => base ** exponent,
			};
			calculator.registerOperation("power", powerOp);
			// Check if it's there (internal check, not strictly unit, but useful)
			// @ts-expect-error _operations is private
			expect(calculator._operations.has("power")).toBe(true);
		});

		it("should throw if registering an existing operation name", () => {
			expect(() => {
				calculator.registerOperation("add", {
					symbol: "+",
					execute: (a, b) => a + b,
				});
			}).toThrow('Operation "add" is already registered.');
		});

		it("should execute a registered custom operation and update state", () => {
			const powerOp: Omit<NamedOperation, "name"> = {
				symbol: "^",
				execute: (base, exponent) => base ** exponent,
			};
			calculator.registerOperation("power", powerOp);
			calculator.setValue(2); // History: [setValue]
			calculator.executeOperation("power", 3); // 2^3 = 8. CurrentValue = 8. History: [setValue, power]

			expect(calculator.currentValue).toBe(8);
			expect(calculator.history.length).toBe(2);
			const lastOp = calculator.history[1];
			expect(lastOp.operationName).toBe("power");
			expect(lastOp.operands).toEqual([2, 3]);
			expect(lastOp.valueAfter).toBe(8);
		});

		it("should throw if executing an unregistered operation", () => {
			expect(() => {
				calculator.executeOperation("nonExistentOp", 5);
			}).toThrow('Operation "nonExistentOp" is not registered.');
		});

		it("custom operation result should be rounded", () => {
			calculator.registerOperation("customDiv", {
				symbol: "/custom",
				execute: (a, b) => a / b,
			});
			calculator.setValue(10);
			calculator.precision = 2;
			calculator.executeOperation("customDiv", 3); // 10 / 3 = 3.333... -> 3.33
			expect(calculator.currentValue).toBe(3.33);
		});
	});

	describe("_round() private method (tested via public methods)", () => {
		it("should round numbers correctly based on precision", () => {
			calculator.precision = 2;
			calculator.setValue(0); // to isolate rounding in next op
			calculator.add(1.2345); // result 1.23
			expect(calculator.currentValue).toBe(1.23);

			calculator.setValue(0);
			calculator.add(1.2355); // result 1.24
			expect(calculator.currentValue).toBe(1.24);

			calculator.precision = 0;
			calculator.setValue(0);
			calculator.add(1.5); // result 2
			expect(calculator.currentValue).toBe(2);

			calculator.setValue(0);
			calculator.add(1.49); // result 1
			expect(calculator.currentValue).toBe(1);
		});

		it("should not attempt to round Infinity or -Infinity", () => {
			calculator.precision = 2;
			calculator.setValue(0);
			// @ts-expect-error _performOperation is private, directly setting for test
			calculator._currentValue = Number.POSITIVE_INFINITY;
			// @ts-expect-error _round is private
			expect(calculator._round(calculator.currentValue)).toBe(
				Number.POSITIVE_INFINITY,
			);

			// @ts-expect-error _performOperation is private
			calculator._currentValue = Number.NEGATIVE_INFINITY;
			// @ts-expect-error _round is private
			expect(calculator._round(calculator.currentValue)).toBe(
				Number.NEGATIVE_INFINITY,
			);
		});
	});
});
