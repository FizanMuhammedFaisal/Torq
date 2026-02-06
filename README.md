# Workflow Execution System

A Kubernetes-native workflow execution engine for running containerized jobs with DAG-based orchestration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

This project provides a scalable, fault-tolerant workflow execution system that:

- Runs workflows as Kubernetes Jobs
- Supports DAG-based task dependencies
- Provides real-time log streaming via WebSocket
- Uses event sourcing for reliable state management

## 📦 Project Structure

```
workflow-execution-system/
├── apps/
│   ├── api-server/     # Bun REST + WebSocket API
│   ├── operator/       # Kubernetes Workflow Operator (coming soon)
│   └── web/            # React + Vite frontend
├── packages/
│   └── shared/         # Shared types and utilities (coming soon)
├── infra/              # Kubernetes manifests (coming soon)
├── docs/               # Documentation
└── examples/           # Sample workflow definitions
```

## 🛠️ Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Node.js 18+ (for Vite)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/workflow-execution-system.git
cd workflow-execution-system

# Install dependencies
bun install
```

### Development

```bash
# Start API server (http://localhost:3000)
bun run dev:api

# Start web app (http://localhost:5173)
bun run dev:web
```

### Verify Setup

```bash
# Test API health
curl http://localhost:3000/health
# {"status":"ok","timestamp":"..."}

# Test API root
curl http://localhost:3000/
# {"message":"Workflow Execution System API","version":"0.0.1","endpoints":["/health"]}
```

## 🏗️ Architecture

```
┌─────────┐     ┌──────────────┐     ┌─────────────────┐
│ Client  │────▶│  API Server  │────▶│  K8s Control    │
│ (Web)   │◀────│  (Bun)       │◀────│  Plane          │
└─────────┘     └──────────────┘     └─────────────────┘
                       │                      │
                       ▼                      ▼
                ┌──────────────┐     ┌─────────────────┐
                │  PostgreSQL  │     │  Workflow       │
                │  (Events)    │     │  Operator       │
                └──────────────┘     └─────────────────┘
```

## 📖 Documentation

- [Project Structure](docs/structure.md) - Detailed file structure

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
