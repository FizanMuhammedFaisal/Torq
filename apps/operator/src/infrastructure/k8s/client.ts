import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
//load the kuber config from the standard location
kc.loadFromDefault();
export const kubeConfig = kc;

// used for making CRD
export const apiExtensionsClient = kc.makeApiClient(k8s.ApiextensionsV1Api);
export const apiAppsV1Client = kc.makeApiClient(k8s.AppsV1Api);
// Used for making customObject (CR)
export const customObjectsClient = kc.makeApiClient(k8s.CustomObjectsApi);
export const batchClient = kc.makeApiClient(k8s.BatchV1Api);
export const coreClient = kc.makeApiClient(k8s.CoreV1Api);
export const rbacV1Client = kc.makeApiClient(k8s.RbacAuthorizationV1Api);