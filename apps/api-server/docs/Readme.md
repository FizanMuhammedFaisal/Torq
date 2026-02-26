# Torq Core

Torq Core is a Kubernetes-native workflow execution engine.

It provides deterministic DAG execution, run history tracking, and artifact storage while remaining independent of any specific user management or SaaS platform concerns.

---

## What Torq Core Is

Torq Core is responsible for:

- Accepting workflow definitions via API
- Creating Kubernetes Jobs
- Reconciling workflow state
- Tracking run history
- Storing execution metadata
- Managing artifact references
- Streaming logs

Torq Core does not manage users, organizations, billing, or business logic.

---

## Architecture Overview

Torq Core consists of two primary components:

### 1. API Service

Responsibilities:

- Accept REST and WebSocket requests
- Validate authentication (if enabled)
- Extract namespace/tenant information
- Create Workflow CRDs
- Persist run metadata in PostgreSQL
- Provide log streaming endpoints

Authentication is optional and pluggable.

The API translates identity → namespace.
The Operator never sees identity information.

---

### 2. Workflow Operator

Responsibilities:

- Watch Workflow CRDs
- Reconcile desired vs actual state
- Create Kubernetes Jobs
- Update run status
- Emit lifecycle events
- Persist execution state

The Operator does not handle authentication or user logic.

It only operates on:

- Workflow spec
- Namespace
- Run state

---

## Multi-Tenancy Model

Torq Core isolates workflows using namespaces.

Each workflow and run is associated with a namespace.

Example storage structure:

s3://bucket/{namespace}/{workflow}/{run-id}/artifact.tar.gz


Namespace can be:

- `default` (no-auth mode)
<!-- - Provided via header -->
- Extracted from JWT (auth-enabled mode)

---

## Authentication Model

Authentication is optional.

Supported modes:

- No authentication (development mode)
- JWT validation
- OIDC integration

Torq Core does not store user accounts.

The API layer validates tokens and determines namespace.

---

## Storage Model

PostgreSQL stores:

- Workflow definitions
- Run state
- Step status
- Metadata
- Artifact URIs

Object storage (S3/MinIO/etc.) stores:

- Build artifacts
- Logs (optional)
- Large outputs

Artifacts are never stored directly in the database.

---

## Design Principles

- Operator must remain identity-agnostic
- Auth must be pluggable
- Storage must be abstracted
- Namespace is the isolation boundary
- Engine must remain reusable and self-hostable

---

## Deployment Modes

### Single-Tenant Mode
- No authentication
- All workflows run under `default` namespace

### Auth-Enabled Mode
- API validates identity
- Namespace extracted from token
- Per-namespace isolation enforced

---

Torq Core is designed to be used both:

- As a standalone self-hosted engine
- As the foundation for a multi-tenant platform