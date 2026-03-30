read https://kubernetes.io/docs/reference/using-api/api-concepts/


So the operator works with a loop that watches our crd resouce and do actions accordingly

like a consumer of a distributed change log

https://github.com/kubernetes-client/javascript/blob/main/src/watch.ts

// https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes

Kubernetes gives every object a resouceVersion
a monotonically increasing cursor
when the watcher crashes or restarts
instead of replaying all the events from the start when you pass the lastresouceversoin you can get events that you havent pocesses from there onwards