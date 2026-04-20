import { Envconfig } from "@/config/envconfig";
import { V1DaemonSet } from "@kubernetes/client-node";

const name = 'fluent-bit'
const namespace = 'logging'

export const DEAMON_SET_DEFINITION: V1DaemonSet = {
    apiVersion: 'apps/v1',
    kind: 'DaemonSet',
    metadata: {
        name,
        namespace,
        labels: { app: name }
    },
    spec: {
        selector: { matchLabels: { app: name } },
        template: {
            metadata: { labels: { app: name } },
            spec: {
                serviceAccountName: 'fluent-bit',
                tolerations: [
                    {
                        key: 'node-role.kubernetes.io/control-plane',
                        operator: 'Exists',
                        effect: 'NoSchedule'
                    }
                ],
                containers: [{
                    name: 'fluent-bit',
                    image: Envconfig.images.fluentBit,
                    imagePullPolicy: 'IfNotPresent',
                    ports: [{ containerPort: 2020 }],
                    livenessProbe: {
                        httpGet: { path: '/api/v1/health', port: 2020 },
                        initialDelaySeconds: 10,
                        periodSeconds: 30
                    },
                    resources: {
                        requests: { cpu: '50m', memory: '64Mi' },
                        limits: { cpu: '200m', memory: '256Mi' }
                    },
                    volumeMounts: [
                        { name: 'varlog', mountPath: '/var/log', readOnly: true },
                        { name: 'varlibdockercontainers', mountPath: '/var/lib/docker/containers', readOnly: true },
                        { name: 'flb-storage', mountPath: '/var/log/flb-storage' },
                        { name: 'config', mountPath: '/fluent-bit/etc/' }
                    ]
                }],
                volumes: [
                    { name: 'varlog', hostPath: { path: '/var/log' } },
                    { name: 'varlibdockercontainers', hostPath: { path: '/var/lib/docker/containers' } },
                    { name: 'flb-storage', hostPath: { path: '/var/log/flb-storage', type: 'DirectoryOrCreate' } },
                    { name: 'config', configMap: { name: 'fluent-bit-config' } }
                ]
            }
        }
    }

}
