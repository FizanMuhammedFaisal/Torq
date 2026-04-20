# how are logs from a workflow reaches users

endgoal is having a ui that users can see every logs output of there workflow 
with seperation of each steps, jobs, etc

here we have jobs they run seperately so we will collects logs from jobs seperately 

## architecture

In kuber we have a [jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) api to run user defined actions

so we will be using that and for that we have a job loop in the operator a job reconciliation loop.

### how are logs collected?

Updated desing looks at a deamon set like fluent bit which can run in a node 
and collect from all kind of pods and then push to a place(redis here) and from there we will using it to serving users and storing in a cold place

for hot and cold serving we use somthing like redis and a database like loki



We are going to use a deamon set from fluent bit, a few reasons to choose somthing like a deamon set instead of sidecard
one major one is deamon set is only one for a node

so its only going to need little resource and this deamon set from fluent bit seem prettry good and widely used for this 
usecase 


#### How logs are shipped

we need a github style log collection on consumtion side

two major consumer for now. one being the worker which saved this to a DB 
another one being the server which delivers this logs live to users ( web-sockets or sse)

so for that we need to send logs form fluent bit to the message broker we have 
redis steams can have many steams open 

we have a few ways to decied on how we are goign to send streams of worklfows

either send all of it one stream,send seperates ones for each jobs , send logs of a worklows to one stream

3 rd one, sending all the logs of a worklflow to a stream seems like the good optoins here since

it give the correct controll for the consumer, not overbloating like option 1 and not toomany streams opens ( which is fine for redis) but need management and all




### fluent bit redis problem 

since fluetbut doesnt have a output redis option, we will also have another option even if it had that is to push each workflow as a stream to redis streams,

A possible solution is a ingesion process that can be http endpoint thata takees all of this output from fluent bit and then push to corresponding redis stream 

this can be great since we can do transformatoin also here in this process

since we can deply this as stateless pod it wouldnt be much of a problem unless either redis or fluentbit have isssues

anyway if either redis or logs proecessor is down we will reject the injectin request from fleunt bit and it wil have to buffer the logs in memery with a limit we set so that it can be in the cluster untill both of them comes back up 

the backpressure issues can be avoidded with correct congition on fluent bit and a injetion process which hanldes this correctly


#### How does logs travel from pod to client side

so in a node we have a container run time engine (eg:docker)

When a container writes to stdout/stderr, the runtime captures that and writes it to a file on the node's filesystem not inside the container on the actual host disk


Fluent Bit runs as a DaemonSet, one pod per node. It needs to read those log files which are on the node's disk.
 not inside its own container filesystem. So when we mount the node's /var/log directory into the Fluent Bit container. Now Fluent Bit can see all the log files for every pod on that node as if they were local files.


From here the logs are went to the ingestor enpoint which will take all logsand pushes to the correct stream and from there workflow logs are consumed by a woker for pushing to database and apiserver of torq to show to clients live if asked
else query from db

