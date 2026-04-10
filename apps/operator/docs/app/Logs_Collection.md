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







