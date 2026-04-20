## Hanlding Deletion

when a worlfow exeuctoin is completed deletion process is started. before deletion of a crd on a operator there 
mgiht be things that needs to done such as sending status off to other components, saving status to db

For that we use finilizers

Finalizers are strings added to the ```metadata.finalizers``` field of a resource. When a user deletes a resource with a finalizer, the API server does not immediately remove it; instead, it sets a deletionTimestamp.The operator’s reconciliation loop detects this timestamp and executes its custom cleanup logic , once the external cleanup is successful, the operator removes the finalizer string, allowing Kubernetes to finish the deletion.

The implementation of finalizer logic must be carefully orchestrated to avoid "stuck" resources. If an operator fails to remove a finalizer, the resource will remain in a "Terminating" state indefinitely. Developers should ensure that the finalizer logic is idempotent and capable of handling partially completed cleanup operations.


### Problmes when dealing with reconciliation loop

The reconciliation loop must be idempotent. Running the same reconciliation multiple times with the same input must produce the same result without side effects. This means you should always check if a resource exists before creating it, compare the current state before updating, and never assume the order of events.

