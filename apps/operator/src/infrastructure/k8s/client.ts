import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig()
//load the kuber config from the standard location 
kc.loadFromDefault();

export const kubeConfig = kc

export const apiExtensionsClient = kc.makeApiClient(k8s.ApiextensionsV1Api)
export const customObjectsClient = kc.makeApiClient(k8s.CustomObjectsApi)
export const batchClient = kc.makeApiClient(k8s.BatchV1Api)
export const coreClient = kc.makeApiClient(k8s.CoreV1Api)
