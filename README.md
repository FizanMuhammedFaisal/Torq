# Workflow Execution System

A Kubernetes-native workflow execution engine for running containerized jobs with DAG-based orchestration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Getting Started](docs/getting-started.md) • [Concepts](docs/concepts.md) • [Architecture](docs/architecture.md) • [Contributing](CONTRIBUTING.md)

</div>

---

## Accelerate Your Operations

**Workflow Execution System** is a security-first, event-driven orchestration engine designed to automate complex processes at scale. Built natively for Kubernetes, it empowers engineering teams to build, run, and monitor automation workflows with unparalleled reliability and speed.

Stop writing glue code. Start orchestrating value.

## Key Capabilities

### ⚡️ Event-Driven Automation

Trigger workflows instantly from any source. Whether it's a webhook, a system event, or a scheduled task, our engine reacts in real-time to drive your business logic forward.

### 🛡️ Assessing Security Posture

Built with safety in mind. Execute arbitrary containerized steps with strict isolation. Define granular permissions and resource limits to ensure your automation never compromises your infrastructure.

### 🔗 Seamless Integrations

Connect your entire stack. Orchestrate actions across cloud providers, SaaS tools, and internal microservices. Our modular architecture allows for infinite extensibility.

### Real-Time Observability

Gain deep insights into your automation. Watch workflows execute step-by-step with live log streaming. Analyze performance metrics and trace execution paths to optimize your processes.

## 🏗️ Architecture

Built on modern foundations for maximum resilience:

- **Kubernetes-Native**: Runs steps as K8s Jobs for scalability and isolation.
- **Event Sourcing**: Every state change is immutable and auditable.
- **High Performance**: Powered by Bun for lightning-fast API responses.
- **Modern Frontend**: A reactive, beautiful UI built with React and Vite.



## 📚 Documentation

Explore our comprehensive guides to master the platform:

| Topic                                          | Description                                                             |
| :--------------------------------------------- | :---------------------------------------------------------------------- |
| **[Getting Started](docs/getting-started.md)** | Deploy your first instance and run a "Hello World" workflow in minutes. |
| **[Core Concepts](docs/concepts.md)**          | Learn about Workflows, Steps, Triggers, and Context.                    |
| **[Architecture](docs/architecture.md)**       | Deep dive into the system internals and design decisions.               |

## 🛠️ Quick Start

Ready to dive in?

```bash
# Clone the repository
git clone https://github.com/your-username/workflow-execution-system.git

# Install dependencies
bun install

# Start the development server
bun run dev
```

For full deployment instructions, see the [Getting Started Guide](docs/getting-started.md).

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
