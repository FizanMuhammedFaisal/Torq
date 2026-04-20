https://kubernetes.io/docs/concepts/workloads/controllers/job/

https://kubernetes.io/docs/concepts/workloads/pods/init-containers/


all the other resources under concepts/workloads are usefull to know











### Init Containers
form docs:
List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info:
 https://kubernetes.io/docs/concepts/workloads/pods/init-containers/


### JOB API refence docs from notebook llm

The following reference guide explains the primary fields and keys within a Kubernetes **Job** object, based on the provided TypeScript structure and established Kubernetes operator patterns.

**1. Root Level Identification**

- **apiVersion**: Specifies the version of the Kubernetes API to use for this object (typically **`batch/v1`** for Jobs).
- **kind**: Defines the type of resource being created, which in this case is a **Job**, a workload for short-lived batch tasks.

**2. Metadata: Identification and Lifecycle**

- **name & namespace**: The unique identifier for the Job and the specific virtual cluster area where it resides.
- **labels**: Key-value pairs used for **selection and grouping**. These are critical for your "Loop 2" watcher to identify and filter Jobs belonging to your operator.
- **annotations**: Non-identifying metadata used to store internal Torq tracking information that does not need to be indexed for selection.
- **ownerReferences**: Establishes a parent-child relationship between the Job and your Custom Resource (CRD). This enables **automatic garbage collection**, where Kubernetes deletes the Job when the parent workflow is removed.

**3. Job Specification (`spec`)**

- **backoffLimit**: Determines the number of retries Kubernetes will attempt before marking the Job as failed. Setting this to **`0`** delegates all retry logic to your Torq platform instead of Kubernetes.
- **ttlSecondsAfterFinished**: A time-to-live mechanism that automatically cleans up (deletes) the Job and its Pods from **etcd** a set number of seconds after completion or failure.

**4. Pod Template Metadata**

- **template.metadata.labels**: These labels are applied to the Pods created by the Job. They allow your controller to map Pod events and logs back to the specific Job and workflow run.

**5. Pod Template Specification (`template.spec`)**

- **restartPolicy**: Dictates how Kubernetes handles container exits. For Jobs, this is typically set to **Never** (restarts the Job with a new Pod) or **`OnFailure`** (restarts the container within the same Pod).
- **serviceAccountName**: The identity used by the Pod to interact with the Kubernetes API. This should follow the **principle of least privilege**, granting only the specific RBAC permissions needed for the task.
- **initContainers**: Specialized containers that run to completion before the main application containers start.
    - **Sidecar Pattern**: Since Kubernetes v1.29, defining an init container with a **`restartPolicy: Always`** allows it to act as a **native sidecar** that stays running for the Pod's entire life (e.g., for log streaming).
- **containers**: The primary workload container(s) that execute after all non-sidecar init containers have successfully finished.
- **volumes**: Provides shared storage (such as an **`emptyDir`**) that can be mounted into multiple containers within the same Pod, allowing for data exchange between your git-clone, step-runner, and sidecar containers