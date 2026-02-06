# Workflow Execution System - API Server

Bun-based REST API server with WebSocket support.

## Development

```bash
# From project root
bun run dev:api

# Or from this directory
bun run dev
```

## Endpoints

| Method | Path      | Description  |
| ------ | --------- | ------------ |
| GET    | `/`       | API info     |
| GET    | `/health` | Health check |

## Configuration

Environment variables (create `.env` file):

```bash
PORT=3000
NODE_ENV=development
```
