import type { V1ConfigMap } from '@kubernetes/client-node';
import { Envconfig } from '@/config/envconfig';

const name = 'fluent-bit-config';
const namespace = 'logging';
// needs cahnging
export const CONFIG_MAP_DEFINITION: V1ConfigMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: { name, namespace },
    data: {
        'fluent-bit.conf': `[SERVICE]
    Flush         3
    Log_Level     info
    HTTP_Server   On
    HTTP_Listen   0.0.0.0
    HTTP_Port     2020
    storage.path              /var/log/flb-storage/
    storage.sync              normal
    storage.checksum          off
    storage.max_chunks_up     128
    storage.backlog.mem_limit 50M

[INPUT]
    Name              tail
    Path              /var/log/containers/*.log
    multiline.parser  cri
    DB                /var/log/flb-storage/flb_kube.db
    Tag               kube.*
    Refresh_Interval  8
    Mem_Buf_Limit     50MB
    Skip_Long_Lines   On
    storage.type      filesystem
    threaded          off       


[FILTER]
    Name                kubernetes
    Match               kube.*
    Kube_URL            https://kubernetes.default.svc:443
    Kube_CA_File        /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    Kube_Token_File     /var/run/secrets/kubernetes.io/serviceaccount/token
    Merge_Log           On
    Keep_Log            On
    Buffer_Size         64k
    Kube_Tag_Prefix     kube.var.log.containers.

[FILTER]
    Name    grep
    Match   kube.*
    Regex   $kubernetes['labels']['collect-logs'] ^true$

[OUTPUT]
    Name    http
    Format  json
    Match   kube.*
    Host    ${Envconfig.services.logIngestor.host}
    Port    ${Envconfig.services.logIngestor.port}
    URI     /ingest
    storage.total_limit_size 2G
    Retry_Limit False`,
    },
};
