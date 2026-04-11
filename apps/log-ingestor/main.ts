Bun.serve({
    port: 3000,
    async fetch(req) {
        // We only want to process POST requests from Fluent Bit
        if (req.method === "POST") {
            try {
                // Read the incoming stream and parse it as JSON
                const logData = await req.json();

                // Log it beautifully to your console
                console.log("🪵 [Fluent Bit Logs Received]:");
                console.dir(logData, { depth: null, colors: true });

                // Return a 200 status so Fluent Bit doesn't retry sending
                return new Response("Logs ingested successfully", { status: 200 });
            } catch (error) {
                console.error("Failed to parse incoming log data:", error);
                return new Response("Bad Request", { status: 400 });
            }
        }

        // Ignore GET requests or browser visits
        return new Response("Log Ingestor is running. Send POST requests here.", { status: 404 });
    },
});

console.log("Fluent Bit ingest server running on http://localhost:3000");