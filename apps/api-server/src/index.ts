/**
 * Workflow Execution System - API Server
 */

console.log(" Workflow API Server starting...");
console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
console.log(` Bun version: ${Bun.version}`);

// Simple HTTP server to verify things work
const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/health") {
            return Response.json({ status: "ok", timestamp: new Date().toISOString() });
        }

        return Response.json({
            message: "Workflow Execution System API",
            version: "0.0.1",
            endpoints: ["/health"],
        });
    },
});

console.log(`Server running at http://localhost:${server.port}`);
