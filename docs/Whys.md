## This is just a document to answer some question i and some one looking at this project may have

#### Why is torq Kubernetes native

Torq utalizes kuber for its core operators, uses its api,controllers,declrative model
when buidling torq i wanted a sysmte that is resilient and that just works.

if i were to build a cicd automation system then it would need a lot of components that keep it stable that make it work
by choosing to use kubers api we can reduce the solved complexity, and add good operations consistancy so this system can be used and modfied by devs

if i were to build without kuber i would need to build a scheduler or orchestrator , a queue that packs out tasks, a worker abstraction that can picks up run these, a heart beast system for workers, a state managing abstration to keep a whole workflow and its each jobs state and other distributed systems problems 
