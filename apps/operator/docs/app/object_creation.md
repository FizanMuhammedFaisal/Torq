https://kubernetes.io/docs/concepts/overview/working-with-objects/names/


Every object in your cluster has a Name that is unique for that type of resource. Every Kubernetes object also has a UID that is unique across your whole cluster



we cannot have two WorkflowRun objects named run-123 in the default namespace. (This triggers the 409 Conflict).
