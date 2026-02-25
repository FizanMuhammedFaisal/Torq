import { describe, expect, it } from "bun:test";

/**
 * Sample unit tests to demonstrate Bun's test runner
 */

describe("Sample Tests", () => {
    describe("Math Operations", () => {
        it("should add numbers correctly", () => {
            expect(1 + 1).toBe(2);
        });

        it("should multiply numbers correctly", () => {
            expect(3 * 4).toBe(12);
        });
    });

});
