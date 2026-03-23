# how are logs from a workflow reaches users

endgoal is having a ui that users can see every logs output of there workflow 
with seperation of each steps, jobs, etc

here we have jobs they run seperately so we will collects logs from jobs seperately 

## architecture

In kuber we have a [jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) api to run user defined actions

so we will be using that and for that we have a job loop in the operator a job reconciliation loop.

how are logs collected?
we will put two containers for a job one is the user defined action container and the other is a sidecar container that will collect the logs from the user defined action container and send it to the logs database

for hot and cold serving we use somthing like redis and a database like loki





