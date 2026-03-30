# Reconciliation

The main thing this service (the operator) does is just run a reconciliation loop that balances the spec and status of the workflow run (our CRD).

## Meaning

Meaning, we want to watch our resource and make Kubernetes do what the given state dictates. Kubernetes is basically built around this pattern of desired state vs. current state.

For a custom resource, we write the loop that represents the reconciliation loop.

### Flow of our reconciliation loop

before going deep 

we will need two loops one for our custom resouce to manage it and one to manage the jobs that are created by our operator(crd)

lets look at waht loop1(crd watcher will do)

so in loop we get actions like added, modified, deleted line by line refer waching.kuber.md

## Loop1 (CRD)

1. watches crd modified/added events using k8s api
2. track the "lastResourceVersion" refer watching_kuber.md
3. mappes to domain entity
4. we call the reconciler the main logic
5. first check if there is a deletedTimestamp set, if set we would need to remove all the associated things with this resouce also remove the finilizer set.
6. then check if it is marked as Succeeded/Failed/Cancelled then return , do nothing
7. then check if torqVersion is supported and if not mark failed do sideeffects actions
8. then check if version is there cause we will need different logic for different versions, and each of them need a reconciler loop that handler there logic
9. we route event to the correct hanlder

inside that hanlder

1. get the spec of the workflow ( use a cache inmemery or external) through grpc from api server
2. for each steps in this 

1. leases acquire:
 lease is needed here to ensure only one jobrunner is being runned for a job
 if there is already a lease skip

2. make secrects for the job and used owned rerfece i guess (TODO: check )
3. create the job wiht all the things, add a log sidecar that can do the log streaming refer Logs_Collection.md
4. update postgress audit log for observabilty 
5. publish to message broker for apiserver to consume an update 

## Loop2 (Job Watcher)

K8s streams job modified events (label:managedby-torq)
