The rules are:

alpha — you can break it anytime, no guarantees
beta — shape is mostly settled, trying to stabilize
stable (v1, v2) — frozen forever, you never break this


### How are we storing a workflow

for each workflow we have versions, when users edit a workflow we can add a new versoin of the same workflow so acutal data of a worlfow is seperate from its refernce

this allows to have many versions stored, then we store the raw data from users and the validated json

### how workflow validation is done

we have versions for our Torq dsl, so we have versioned validators 
we have one common pipeline that can orchestrates this , its writted completely on domain without depedencies, it does the processing,
what are processings?
- it can check if the given syntax is valid yaml or json(uses yaml as dependecy for this )
- it then prceed to check the version of the spec
- it then call the versioned hanlder that can hanlde the validation
we have two type of validation one is syntax or schema other is semantics (how things behave eg: DAG )
- it then calls both validators
- if all of this is passed then the given spec is valid if not errors is throws and bubbled up to client side editor

#### now workflow is correct added this can be used to run this workflow which apiserver then calls the operator for
