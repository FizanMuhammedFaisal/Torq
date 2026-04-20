**node ingestor — behaviour spec**

**deployment: k8s**

replicas`1` — single replica to guarantee insertion order per workflow run.

restart policy`Always` — stateless service, safe to restart. fluent bit will retry any unacknowledged batches on reconnect.**verified**

**POST /ingest — request handling critical**

ack strategy write to Redis FIRST, respond 204 AFTER. 

back pressure signal return `429` when Redis is unreachable or response time exceeds threshold. fluent bit will retry with backoff. do NOT return 200 and drop

request timeout set a tight Redis command timeout (~2s). if Redis is slow, fail fast with 429. don't let requests hang fluent bit's flush interval will pile up

batch size fluent bit sends chunks of ~2MB (~hundreds of log lines). process the whole batch in one Redis pipeline call  not one Add per log.

