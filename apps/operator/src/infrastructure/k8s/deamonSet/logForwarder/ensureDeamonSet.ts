import { injectable } from "tsyringe";
import { apiAppsV1Client, coreClient, rbacV1Client, } from "../../client";
import { logger } from "@/infrastructure/logger/logger";
import { CONFIG_MAP_DEFINITION } from "./raw/configmap";
import { DEAMON_SET_DEFINITION } from "./raw/deamonSet";
import { ApiException } from "@kubernetes/client-node";

export interface ILogForwarderManager {
    ensureDeamonSet(): Promise<void>
}
// the fluentbit deamon set would need cluster wide acces for collecting logs
// we are giving it the cluser wise rbac acceess
@injectable()
export class LogForwarder implements ILogForwarderManager {
    private namespace = 'logging';
    private name = 'fluent-bit';
    async ensureDeamonSet(): Promise<void> {
        try {
            await apiAppsV1Client.readNamespacedDaemonSet({
                name: this.name,
                namespace: this.namespace
            })
            logger.info('[LogForwarder]: Fluent Bit DaemonSet exists, skipping');
        } catch (err) {
            if (err instanceof ApiException) {
                if (err.code !== 404) throw err;
            } else {
                throw err
            }
        }

        //make sure that namespace is present
        await this.ensureNamespace()

        // //For giving fluent bit access
        await this.applyServiceAccount()
        await this.applyClusterRole()
        await this.applyClusterRoleBinding()

        //  Create ConfigMap with Fluent Bit config
        await this.applyConfigMap();

        // //  Create the DaemonSet
        await apiAppsV1Client.createNamespacedDaemonSet({
            namespace: this.namespace,
            body: this.getDaemonSetManifest()  // returns the manifest object
        });

        console.log('Fluent Bit DaemonSet created successfully');
    }

    private async ensureNamespace() {
        try {
            await coreClient.readNamespace({ name: this.namespace });
            logger.info(`[LogForwarder]: namespace: ${this.namespace} Exits`);
        } catch (err) {
            if (err instanceof ApiException) {
                if (err.code !== 404) throw err;
                await coreClient.createNamespace({
                    body: {
                        apiVersion: 'v1',
                        kind: 'Namespace',
                        metadata: { name: this.namespace }
                    }
                });
                logger.info(`[LogForwarder]: Created namespace: ${this.namespace}`);
            } else {
                throw err
            }
        }

    }
    private async applyServiceAccount() {

        try {
            await coreClient.readNamespacedServiceAccount({ name: this.name, namespace: this.namespace });
            logger.info(`[LogForwarder]: service account exits`);
        } catch (err) {
            if (err instanceof ApiException) {
                if (err.code !== 404) throw err;
                await coreClient.createNamespacedServiceAccount({
                    namespace: this.namespace,
                    body: {
                        apiVersion: 'v1',
                        kind: 'ServiceAccount',
                        metadata: { name: this.name, namespace: this.namespace }
                    }
                });
                logger.info(`[LogForwarder]: service account Created`);
                return
            }
            throw err
        }


    }
    private async applyClusterRole() {
        const body = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'ClusterRole',
            metadata: { name: this.name },
            rules: [
                {
                    apiGroups: [''],
                    resources: ['pods', 'namespaces', 'nodes'],
                    verbs: ['get', 'list', 'watch']
                }
            ]
        };

        try {
            await rbacV1Client.readClusterRole({ name: this.name });
            // already exists - just patch it 
            // await rbacV1Client.patchClusterRole({
            //     name: this.name,
            //     body,
            // });
            logger.info(`[LogForwarder]: Cluster Role Exits`);
        } catch (err) {
            if (err instanceof ApiException) {
                if (err.code !== 404) throw err;
                await rbacV1Client.createClusterRole({ body });
                logger.info(`[LogForwarder]: Cluster Role Created`);
                return
            }
            throw err
        }


    }
    private async applyClusterRoleBinding() {

        const body = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: 'ClusterRoleBinding',
            metadata: { name: this.name },
            roleRef: {
                apiGroup: 'rbac.authorization.k8s.io',
                kind: 'ClusterRole',
                name: this.name
            },
            subjects: [
                {
                    kind: 'ServiceAccount',
                    name: this.name,
                    namespace: this.namespace // the namespace where the ServiceAccount lives
                }
            ]
        };

        try {
            await rbacV1Client.readClusterRoleBinding({ name: this.name });
            // await rbacV1Client.patchClusterRoleBinding({
            //     name: this.name,
            //     body
            // });
            logger.info(`[LogForwarder]: Cluster Role Binding Exits`);
        } catch (err) {
            if (err instanceof ApiException) {
                if (err.code !== 404) throw err;
                await rbacV1Client.createClusterRoleBinding({ body });
                logger.info(`[LogForwarder]: Cluster Role Binding Created`);
                return
            }
            throw err
        }


    }
    private async applyConfigMap() {
        const name = 'fluent-bit-config';
        try {
            //checkinf if this config exits
            await coreClient.readNamespacedConfigMap({
                namespace: this.namespace,
                name
            })
            // await coreClient.patchNamespacedConfigMap({
            //     name, namespace: this.namespace, body: CONFIG_MAP_DEFINITION,
            // });
        } catch (error) {
            if (error instanceof ApiException) {
                if (error.code !== 404) throw error;
                await coreClient.createNamespacedConfigMap({ namespace: this.namespace, body: CONFIG_MAP_DEFINITION });
                return
            }
            throw error
        }
    }
    private getDaemonSetManifest() {
        return DEAMON_SET_DEFINITION
    }
}

