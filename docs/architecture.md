# System Architecture

The Workflow Execution System is designed for scalability, reliability, and security. It leverages Kubernetes for orchestration and an event-driven architecture for state management.

## High-Level Overview

```mermaid
graph TD
    User[User / External System] -->|Trigger| API[API Server (Bun)]
    API -->|Validation| DB[(PostgreSQL)]
    API -->|Dispatch| K8S[Kubernetes Cluster]

    subgraph Execution Plane
        K8S -->|Schedule| Job[K8s Job]
        Job -->|Execute| Pod[Pod]
    end

    Pod -->|Logs/Status| API
    API -->|Stream| Client[Web Client]
```

## Key Components

### 1. API Server (Bun)

- **Role**: The central control plane.
- **Responsibilities**:
  - Receives workflow execution requests.
  - Validates workflow definitions.
  - Manages persistent state using Event Sourcing.
  - Exposes a WebSocket endpoint for real-time log streaming.

### 2. Execution Engine (Kubernetes)

- **Role**: The heavy lifter.
- **Mechanism**: Each workflow step is translated into a Kubernetes Job.
- **Benefits**:
  - **Isolation**: Steps run in separate containers, preventing cross-contamination.
  - **Scalability**: Leverage K8s cluster capabilities to run thousands of concurrent steps.
  - **Resilience**: K8s handles pod restarts and node failures automatically.

### 3. Event Sourcing

- **Role**: The source of truth.
- **Implementation**: All state changes (Started, Completed, Failed) are stored as an immutable sequence of events.
- **Advantages**:
  - Complete audit trail.
  - Ability to replay execution history.
  - Easy debugging and monitoring.

## Security Model

- **Container Isolation**: Steps run in ephemeral containers with restricted permissions.
- **Network Policies**: By default, steps have no network access unless explicitly granted.
- **Resource Limits**: CPU and Memory limits are enforced per step to prevent resource exhaustion.

## Frontend Application Configuration
The platform uses a centralized React Context for environment-based feature flags to ensure consistency across the application.
When checking if features (like Authentication) are enabled in UI components or hooks, **always** use the `useAppConfig()` hook from `@/lib/app-config` rather than reading `import.meta.env` directly.

```tsx
import { useAppConfig } from '@/lib/app-config';

function MyComponent() {
  const config = useAppConfig();
  if (!config.authEnabled) return <PublicView />;
  return <ProtectedView />;
}
```
