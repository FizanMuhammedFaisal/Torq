# Torq Dashboard Web

Torq Dashboard is the frontend interface for interacting with Torq Core.

It provides visibility and control over workflows, runs, and execution state.

The dashboard is designed to work in both authenticated and non-authenticated deployments.

---

## Purpose

The Dashboard allows users to:

- Create workflows
- Trigger workflow runs
- View execution status
- Stream logs
- Inspect step details
- View run history
- Download artifacts

It communicates exclusively with the Torq API.

---

## Authentication Behavior

The dashboard adapts based on API configuration.

### No-Auth Mode

- No login screen
- All workflows operate under the default namespace

### Auth-Enabled Mode

- Login button appears
- Token is acquired via OIDC/JWT
- Requests include Authorization header
- Namespace is derived from identity

The dashboard does not manage users directly.
It relies entirely on the backend for identity validation.

---

## Core Screens

### 1. Workflows List
- List of workflows by namespace
- Create new workflow
- Edit workflow definition
- Delete workflow

### 2. Workflow Detail View
- DAG visualization
- Recent runs
- Execution statistics

### 3. Run Detail View
- Step-by-step status
- Duration
- Retry information
- Logs streaming
- Artifact links

### 4. Live Logs View
- WebSocket-based streaming
- Filter by step
- Search logs

---

## Design Principles

- Frontend is a thin client
- All state authority lives in API
- No business logic duplicated in UI
- Namespace awareness controlled by backend
- Auth handled through token-based requests

---

## Future Extensions (Optional)

The dashboard may later support:

- Namespace switching
- RBAC-based visibility
- Multi-cluster views
- Metrics visualization
- Audit history browsing

These features should rely on API support rather than embedding policy logic in the frontend.

---

## Separation from Platform

The dashboard is not tied to SaaS concerns.

If Torq Cloud (platform layer) is introduced, the same dashboard can:

- Connect to a hosted API
- Operate with multi-tenant auth
- Display per-organization isolation

The dashboard remains a client of the Torq API.

---

Torq Dashboard exists to provide operational visibility and control.
It does not define workflow execution logic.
That responsibility remains in Torq Core.