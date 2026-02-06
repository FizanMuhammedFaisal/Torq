workflow-engine/
├── README.md
├── DESIGN.md # Architecture decisions
├── docker-compose.yml # Local dev: Postgres, Redis, MinIO
├── Makefile # Common commands
│
├── packages/
│ │
│ ├── api/ # API Server (Bun )
│ │ ├── src/
│ │ │ ├── index.ts # Entry point
│ │ │ ├── config.ts # Env vars, constants
│ │ │ │
│ │ │ ├── routes/ # HTTP endpoints
│ │ │ │ ├── workflows.ts # POST /workflows, GET /workflows/:id
│ │ │ │ ├── logs.ts # GET /logs/:workflowId
│ │ │ │ └── health.ts # Health check
│ │ │ │
│ │ │ ├── middleware/ # Auth, validation, error handling
│ │ │ │ ├── auth.ts
│ │ │ │ ├── validate.ts # YAML/JSON schema validation
│ │ │ │ └── errors.ts
│ │ │ │
│ │ │ ├── websocket/ # Real-time log streaming
│ │ │ │ ├── server.ts
│ │ │ │ └── rooms.ts # workflow:id room management
│ │ │ │
│ │ │ └── services/ # Business logic
│ │ │ ├── k8s-client.ts # Talks to K8s API
│ │ │ ├── postgres-client.ts
│ │ │ └── redis-client.ts
│ │ │
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── Dockerfile
│ │
│ ├── operator/ # Workflow Operator (Controller)
│ │ ├── src/
│ │ │ ├── index.ts # Entry point, controller loop
│ │ │ ├── config.ts # Operator configuration
│ │ │ │
│ │ │ ├── controller/ # The "Brain"
│ │ │ │ ├── watcher.ts # Watches K8s Workflow CRDs
│ │ │ │ ├── reconciler.ts # Main control loop
│ │ │ │ └── dag.ts # Dependency graph evaluation
│ │ │ │
│ │ │ ├── handlers/ # Action handlers
│ │ │ │ ├── create-job.ts # Creates K8s Job
│ │ │ │ ├── update-status.ts # Updates Workflow CR status
│ │ │ │ └── cleanup.ts # Garbage collection
│ │ │ │
│ │ │ ├── leasing/ # Fencing tokens, exactly-once
│ │ │ │ ├── acquire.ts
│ │ │ │ ├── renew.ts # Heartbeat
│ │ │ │ └── release.ts
│ │ │ │
│ │ │ ├── eventsourcing/ # Event writing
│ │ │ │ ├── store.ts # Write to Postgres events table
│ │ │ │ └── replay.ts # Recover state from events
│ │ │ │
│ │ │ └── sidecars/ # Log shipper config generator
│ │ │ └── logshipper.ts
│ │ │
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── Dockerfile
│ │
│ ├── shared/ # Common code (types, utils)
│ │ ├── src/
│ │ │ ├── types/
│ │ │ │ ├── workflow.ts # Workflow CRD TypeScript types
│ │ │ │ ├── events.ts # Event types
│ │ │ │ └── dsl.ts # DSL schema (Zod)
│ │ │ │
│ │ │ ├── utils/
│ │ │ │ ├── logger.ts
│ │ │ │ ├── hash.ts # Content hashing for caching
│ │ │ │ └── retry.ts
│ │ │ │
│ │ │ └── constants/
│ │ │ └── index.ts
│ │ │
│ │ ├── package.json
│ │ └── tsconfig.json
│ │
│ └── web/ # React Frontend
│ ├── public/
│ ├── src/
│ │ ├── main.tsx
│ │ ├── App.tsx
│ │ │
│ │ ├── components/
│ │ │ ├── WorkflowForm.tsx # YAML upload
│ │ │ ├── WorkflowList.tsx # Dashboard table
│ │ │ ├── WorkflowDetail.tsx # Single workflow view
│ │ │ ├── DagVisualizer.tsx # ReactFlow graph
│ │ │ └── LogViewer.tsx # Virtualized log stream
│ │ │
│ │ ├── hooks/
│ │ │ ├── useWorkflow.ts # TanStack Query
│ │ │ ├── useLogs.ts # WebSocket hook
│ │ │ └── useWebSocket.ts
│ │ │
│ │ ├── services/
│ │ │ └── api.ts
│ │ │
│ │ └── types/
│ │ └── index.ts
│ │
│ ├── package.json
│ ├── vite.config.ts
│ └── Dockerfile
│
├── infra/ # Kubernetes manifests
│ ├── crd/
│ │ └── workflow-crd.yaml # CustomResourceDefinition
│ │
│ ├── operator/
│ │ ├── deployment.yaml # Operator Deployment
│ │ ├── serviceaccount.yaml # RBAC: cluster-admin for Jobs
│ │ └── rbac.yaml # Roles and bindings
│ │
│ ├── api/
│ │ ├── deployment.yaml # API Server Deployment
│ │ ├── service.yaml # ClusterIP
│ │ ├── ingress.yaml # NGINX Ingress
│ │ └── hpa.yaml # HorizontalPodAutoscaler
│ │
│ ├── sidecars/
│ │ └── log-shipper/
│ │ ├── Dockerfile # Log shipper image
│ │ └── shipper.ts # Tail logs → Redis
│ │
│ └── monitoring/
│ ├── fluent-bit.yaml # DaemonSet for node logs
│ ├── loki.yaml # Log aggregation
│ └── prometheus.yaml # Metrics
│
├── migrations/ # PostgreSQL schema
│ ├── 001_initial.sql
│ ├── 002_events_table.sql
│ ├── 003_leases_table.sql
│ └── 004_audit_log.sql
│
├── examples/ # Sample DSL files
│ ├── simple-build.yaml
│ ├── parallel-tests.yaml
│ ├── matrix-build.yaml
│ └── human-approval.yaml
│
└── scripts/
├── dev-setup.sh # kind/k3d cluster + apply CRD
├── deploy-operator.sh
├── deploy-api.sh
└── chaos-test.sh # Kill pod, test recovery
