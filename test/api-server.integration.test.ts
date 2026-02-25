import { describe, expect, it } from "bun:test";

/**
 * Integration tests for the API server.
 * These tests require the server to be running: `bun run dev:api`
 */
describe.skip("API Server (integration)", () => {
    const baseUrl = "http://localhost:3000";

    describe("Health Check", () => {
        it("should return ok status", async () => {
            const response = await fetch(`${baseUrl}/health`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.status).toBe("ok");
            expect(data.timestamp).toBeDefined();
        });
    });

    describe("Root Endpoint", () => {
        it("should return API info", async () => {
            const response = await fetch(baseUrl);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe("Workflow Execution System API");
            expect(data.version).toBe("0.0.1");
            expect(data.endpoints).toContain("/health");
        });
    });
});
