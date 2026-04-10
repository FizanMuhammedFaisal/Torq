import { injectable } from "tsyringe";
import { apiAppsV1Client, coreClient, rbacV1Client, } from "../../client";
import { logger } from "@/infrastructure/logger/logger";
import { HttpError } from "@/presentation/error/httpError";

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
            const error = err as HttpError
            if (error.response?.statusCode !== 404) throw err;
        }
        //make sure that namespace is present
        this.ensureNamespace()

        //For giving fluent bit access
        this.applyServiceAccount()
        this.applyClusterRole()
        this.applyClusterRoleBinding()

        //  Create ConfigMap with Fluent Bit config
        await this.applyConfigMap();

        //  Create the DaemonSet
        await apiAppsV1Client.createNamespacedDaemonSet({
            namespace: this.namespace,
            body: this.getDaemonSetManifest()  // returns the manifest object
        });

        console.log('Fluent Bit DaemonSet created successfully');
    }

    private async ensureNamespace() {
        try {
            await coreClient.readNamespace({ name: this.namespace });
        } catch (err) {
            const error = err as HttpError
            if (error.response?.statusCode !== 404) throw err;
            await coreClient.createNamespace({
                body: {
                    apiVersion: 'v1',
                    kind: 'Namespace',
                    metadata: { name: this.namespace }
                }
            });
            logger.info(`[LogForwarder]: Created namespace: ${this.namespace}`);
        }
    }
    private async applyServiceAccount() {

        try {
            await coreClient.readNamespacedServiceAccount({ name: this.name, namespace: this.namespace });
        } catch (err) {
            const error = err as HttpError
            if (error.response?.statusCode !== 404) throw err;
            await coreClient.createNamespacedServiceAccount({
                namespace: this.namespace,
                body: {
                    apiVersion: 'v1',
                    kind: 'ServiceAccount',
                    metadata: { name: this.name, namespace: this.namespace }
                }
            });
        }
        logger.info(`[LogForwarder]: service account exits`);
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
            await rbacV1Client.patchClusterRole({
                name: this.name,
                body,
            });
        } catch (err) {
            const error = err as HttpError
            if (error.response?.statusCode !== 404) throw err;
            await rbacV1Client.createClusterRole({ body });
        }
        logger.info(`[LogForwarder]: Cluster Role Exits`);

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
            await rbacV1Client.patchClusterRoleBinding({
                name: this.name,
                body
            });
        } catch (err) {
            const error = err as HttpError
            if (error.response?.statusCode !== 404) throw err;
            await rbacV1Client.createClusterRoleBinding({ body });
        }
        logger.info(`[LogForwarder]: Cluster Role Binding Exits`);

    }
    private applyConfigMap() {

    }
    private getDaemonSetManifest() {

    }
}





