import { describe, expect, it } from "vitest";

import { template } from "../src";

describe("Template E2E Tests / Scenarios", () => {
	it("Scenario 1: Execute template function", () => {
		expect(typeof template).toBe("function");
		expect(template).not.toThrowError();
	});
});
