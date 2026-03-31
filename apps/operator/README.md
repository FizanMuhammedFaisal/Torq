# Torq Operator

The Kubernetes operator component of Torq, responsible for managing workflow executions as Custom Resources.

> **⚠️ Under Development**: This component is actively being developed. APIs and behavior may change.

## Overview

The operator watches for `WorkflowRun` Custom Resource Definitions (CRDs) in Kubernetes and reconciles their state by:
- Monitoring workflow lifecycle events
- Executing steps as Kubernetes Jobs
- Handling cleanup and finalizers
- Integrating with the API server for state persistence

## Architecture

- **Reconciliation Loop**: Event-driven processing of CRD changes
- **Watchers**: Kubernetes API watchers for CRDs and Jobs
- **gRPC Server**: Communication with other Torq components
- **Clean Architecture**: Domain, Application, and Infrastructure layers

## Development

### Prerequisites
- Kubernetes cluster
- PostgreSQL database
- Node.js/Bun runtime

### Running Locally

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run dev
```

### Building

```bash
pnpm run build
```

## Configuration

See the main [Torq documentation](../docs/) for deployment and configuration details.
