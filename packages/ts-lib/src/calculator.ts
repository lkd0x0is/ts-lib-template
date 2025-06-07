/**
 * Represents a single operation that can be performed.
 * The `execute` function takes the current value and an optional operand.
 * If the operation inherently needs two distinct numbers not including current value,
 * it should be handled by the specific method design.
 * @public
 */
export interface Operation {
	/** A function that performs the calculation.
	 * @param currentValue - The current value in the calculator.
	 * @param operand - The operand for the operation.
	 * @returns The result of the operation.
	 */
	execute: (currentValue: number, operand: number) => number;
	/** The symbol representing the operation, e.g., '+'. Used for display/logging. */
	symbol: string;
}

/**
 * Represents a named operation that can be registered.
 * @public
 */
export interface NamedOperation extends Operation {
	/** The name of the operation (e.g., "add", "power"). */
	name: string;
}

/**
 * Structure for entries in the calculator's history.
 * @public
 */
export interface HistoryEntry {
	/** Name of the operation performed. */
	operationName: string;
	/** Operands used. If it used currentValue, it might be [currentValueBeforeOp, operand]. */
	operands: [number, number?];
	/** The value before this operation was applied (currentValue). */
	valueBefore: number;
	/** The value after this operation was applied (currentValue). */
	valueAfter: number;
}

/**
 * Configuration options for the Calculator.
 * @public
 */
export interface CalculatorOptions {
	/**
	 * The initial precision for calculations.
	 * @defaultValue `2`
	 */
	precision?: number;
	/**
	 * The initial value for the calculator.
	 * @defaultValue `0`
	 */
	initialValue?: number;
}

/**
 * An advanced calculator class with history and chainable operations.
 *
 * @remarks
 * This class provides basic and custom arithmetic operations,
 * maintains a current value, and logs a history of operations.
 *
 * @example
 * ```typescript
 * const calc = new Calculator({ precision: 2, initialValue: 10 });
 * calc.add(5);      // Current value is 15
 * calc.subtract(3); // Current value is 12
 * console.log(calc.currentValue); // Output: 12
 * console.log(calc.history);
 * ```
 * @public
 */
export class Calculator {
	private _precision: number;
	private _currentValue: number;
	private _history: HistoryEntry[];
	private _operations: Map<string, NamedOperation>;

	/**
	 * Constructs a new Calculator instance.
	 * @param options - Optional configuration for the calculator.
	 */
	constructor(options?: CalculatorOptions) {
		this._precision = options?.precision ?? 2;
		if (this._precision < 0) {
			// Ensure precision is not negative from constructor
			this._precision = 0;
		} else {
			this._precision = Math.floor(this._precision);
		}
		this._currentValue = options?.initialValue ?? 0;
		this._history = [];
		this._operations = new Map();
		this._registerDefaultOperations();
	}

	private _registerDefaultOperations() {
		this.registerOperation("add", { symbol: "+", execute: (a, b) => a + b });
		this.registerOperation("subtract", {
			symbol: "-",
			execute: (a, b) => a - b,
		});
		this.registerOperation("multiply", {
			symbol: "*",
			execute: (a, b) => a * b,
		});
		this.registerOperation("divide", {
			symbol: "/",
			execute: (a, b) => {
				if (b === 0)
					return a >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
				return a / b;
			},
		});
	}

	/** Gets the current calculated value. */
	public get currentValue(): number {
		return this._currentValue;
	}

	/** Gets the history of operations performed. */
	public get history(): readonly HistoryEntry[] {
		return [...this._history]; // Return a copy to prevent external modification
	}

	/**
	 * Gets or sets the current precision of the calculator.
	 *
	 * As Getter
	 * @returns The current precision value.
	 *
	 * As Setter
	 * @param value - The new precision value (must be a non-negative integer).
	 * @throws Error if the value is negative.
	 */
	public get precision(): number {
		return this._precision;
	}

	public set precision(value: number) {
		if (value < 0) {
			throw new Error("Precision cannot be negative.");
		}
		this._precision = Math.floor(value);
	}

	private _round(value: number): number {
		if (!Number.isFinite(value)) {
			return value; // Don't try to round Infinity or NaN
		}
		const factor = 10 ** this._precision;
		return Math.round(value * factor) / factor;
	}

	private _performOperation(
		name: string,
		operand: number,
		operationFunc?: NamedOperation,
	): number {
		const operation = operationFunc || this._operations.get(name);
		if (!operation) {
			throw new Error(`Operation "${name}" is not registered.`);
		}

		const valueBefore = this._currentValue;
		const rawResult = operation.execute(this._currentValue, operand);
		const roundedResult = this._round(rawResult);

		this._history.push({
			operationName: operation.name,
			operands: [valueBefore, operand], // Representing it as (currentValue, operand)
			valueBefore,
			valueAfter: roundedResult,
		});
		this._currentValue = roundedResult;
		return this._currentValue;
	}

	/**
	 * Sets the current value of the calculator and clears history.
	 * @param value - The new value to set.
	 * @public
	 */
	public setValue(value: number): this {
		const valueBefore = this._currentValue;
		this._currentValue = this._round(value); // Round initial set value as well
		this._history = []; // Setting a value typically resets context
		this._history.push({
			// Log setValue as an operation
			operationName: "setValue",
			operands: [value],
			valueBefore, // Or some indicator that this was an initial set
			valueAfter: this._currentValue,
		});
		return this;
	}

	/**
	 * Clears the current value to 0 and resets the history.
	 * @public
	 */
	public clear(): this {
		const valueBefore = this._currentValue;
		this._currentValue = 0;
		this._history = [];
		this._history.push({
			operationName: "clear",
			operands: [0],
			valueBefore,
			valueAfter: this._currentValue,
		});
		return this;
	}

	/**
	 * Adds an operand to the current value.
	 * @param operand - The number to add.
	 * @returns The new current value.
	 * @beta
	 */
	public add(operand: number): number {
		return this._performOperation("add", operand);
	}

	/**
	 * Subtracts an operand from the current value.
	 * @param operand - The number to subtract.
	 * @returns The new current value.
	 * @public
	 */
	public subtract(operand: number): number {
		return this._performOperation("subtract", operand);
	}

	/**
	 * Multiplies the current value by an operand.
	 * @param operand - The number to multiply by.
	 * @returns The new current value.
	 * @internal
	 */
	public multiply(operand: number): number {
		return this._performOperation("multiply", operand);
	}

	/**
	 * Divides the current value by an operand.
	 * @param operand - The number to divide by.
	 * @returns The new current value.
	 * @alpha
	 */
	public divide(operand: number): number {
		return this._performOperation("divide", operand);
	}

	/**
	 * Registers a new custom operation.
	 * @param name - The name to register the operation under (e.g., "power", "modulo").
	 * @param operation - An object containing the `execute` function and `symbol`.
	 * @throws Error if an operation with the same name already exists.
	 * @public
	 */
	public registerOperation(
		name: string,
		operation: Omit<NamedOperation, "name">,
	): void {
		if (this._operations.has(name)) {
			throw new Error(`Operation "${name}" is already registered.`);
		}
		this._operations.set(name, { ...operation, name });
	}

	/**
	 * Executes a registered operation by its name.
	 * @param operationName - The name of the operation to execute.
	 * @param operand - The operand for the operation.
	 * @returns The new current value.
	 * @throws Error if the operation is not registered.
	 * @public
	 */
	public executeOperation(operationName: string, operand: number): number {
		const op = this._operations.get(operationName);
		if (!op) {
			throw new Error(`Operation "${operationName}" is not registered.`);
		}
		return this._performOperation(operationName, operand, op);
	}
}
