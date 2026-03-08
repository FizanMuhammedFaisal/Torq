//example yaml
// ```yaml
// workflow: build-and-test
// version: "1"

// jobs:

//   build:
//     image: node:20
//     env:
//       NODE_ENV: production
//     steps:
//       - run: npm ci
//       - run: npm run build

//   test:
//     needs: [build]
//     image: node:20
//     secrets:
//       - name: npm-token
//         env: NPM_TOKEN
//     steps:
//       - run: npm test

//   deploy:
//     needs: [test]
//     image: alpine:latest
//     secrets:
//       - name: deploy-key
//         env: DEPLOY_KEY
//     steps:
//       - run: ./deploy.sh
// ```

// ---- to JSON

// {
//   "version": "v1alpha",
//   "workflow": "build-and-test",
//   "jobs": {
//     "build": {
//       "image": "node:20",
//       "env": {
//         "NODE_ENV": "production"
//       },
//       "steps": [
//         { "run": "npm ci" },
//         { "run": "npm run build" }
//       ]
//     },
//     "test": {
//       "needs": ["build"],
//       "image": "node:20",
//       "secrets": [
//         { "name": "npm-token", "env": "NPM_TOKEN" }
//       ],
//       "steps": [
//         { "run": "npm test" }
//       ]
//     },
//     "deploy": {
//       "needs": ["test"],
//       "image": "alpine:latest",
//       "secrets": [
//         { "name": "deploy-key", "env": "DEPLOY_KEY" }
//       ],
//       "steps": [
//         { "run": "./deploy.sh" }
//       ]
//     }
//   }
// }

export const version = 'v1alpha'
export interface Step {
    run: string;
}

export interface SecretRef {
    name: string;  // k8s secret name
    env: string;  // injected as this env var
}
export interface Job {
    image: string;
    needs: string[];
    env?: Record<string, string>;
    secrets?: SecretRef[];
    steps: Step[];
}

export interface WorkflowV1Alpha {
    version: typeof version;
    workflow: string;
    jobs: Record<string, Job>;
}