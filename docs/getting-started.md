# Getting Started with Workflow Execution System

Welcome to the Workflow Execution System! This guide will walk you through setting up your environment, deploying the system, and running your first automation workflow.

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (v1.0+)
- **[Node.js](https://nodejs.org/)** (v18+ for frontend build)
- **[Docker](https://www.docker.com/)** (for running containerized steps)
- **[Kubernetes](https://kubernetes.io/)** (Minikube, Kind, or a remote cluster)

## Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/workflow-execution-system.git
    cd workflow-execution-system
    ```

2.  **Install Dependencies**

    We use `bun` for fast package management.

    ```bash
    bun install
    ```

3.  **Start the API Server**

    The API server handles workflow requests and manages execution state.

    ```bash
    cd apps/api-server
    bun run dev
    ```

    _The server will start on `http://localhost:3000`._

4.  **Start the Web Interface** (Optional)

    For a visual workflow builder and monitoring dashboard:

    ```bash
    cd ../web
    bun run dev
    ```

    _The UI will generally be available at `http://localhost:5173`._

## Running Your First Workflow

Let's create a simple "Hello World" workflow.

### 1. Define the Workflow

Create a JSON file named `hello-world.json` with the following content:

```json
{
  "name": "Hello World Workflow",
  "steps": [
    {
      "id": "step-1",
      "name": "Say Hello",
      "image": "alpine:latest",
      "command": ["echo", "Hello from the Workflow Execution System!"]
    }
  ]
}
```

### 2. Execute the Workflow

Use the API to trigger the workflow using `curl`:

```bash
curl -X POST http://localhost:3000/workflows/execute \
  -H "Content-Type: application/json" \
  -d @hello-world.json
```

### 3. Monitor Execution

If you have the web interface running, navigate to the dashboard to see your workflow running in real-time. Alternatively, check the API server logs for the output.

## Next Steps

- **[Explore Core Concepts](concepts.md)**: Learn about Steps, Triggers, and Decisions.
- **[Architecture Deep Dive](architecture.md)**: Understand how we use Kubernetes Jobs for scalable execution.
