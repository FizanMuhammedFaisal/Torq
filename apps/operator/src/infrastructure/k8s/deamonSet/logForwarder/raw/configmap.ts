import { V1ConfigMap } from "@kubernetes/client-node";
const name = "fluentbut"
const namespace = 'logging'
// needs cahnging 
export const CONFIG_MAP_DEFINITION: V1ConfigMap = {
    apiVersion: 'v1',
    kind: "ConfigMap",
    metadata: { name, namespace },
    data: {
        'fluent-bit.conf': `
          
            [SERVICE]
                Flush         1
                Log_Level     info
                Parsers_File  parsers.conf
                HTTP_Server   On
                HTTP_Listen   0.0.0.0
                HTTP_Port     2020
                storage.path              /var/log/flb-storage/
                storage.sync              normal
                storage.checksum          off

            [INPUT]
                Name              tail
                Path              /var/log/containers/*.log
                multiline.parser  cri
                Tag               kube.*
                Refresh_Interval  5
                Mem_Buf_Limit     50MB
                Skip_Long_Lines   On
                storage.type      filesystem

            [FILTER]
                Name                kubernetes
                Match               kube.*
                Kube_URL            https://kubernetes.default.svc:443
                Kube_CA_File        /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
                Kube_Token_File     /var/run/secrets/kubernetes.io/serviceaccount/token
                Merge_Log           On
                Keep_Log            Off

            [FILTER]
                Name    grep
                Match   kube.*
                Regex   $kubernetes['labels']['collect-logs'] ^true$

            [OUTPUT]
                Name        redis
                Match       *
                Host        redis.logging.svc.cluster.local
                Port        6379
                Stream_Key  pod-logs
                Retry_Limit False
        `  ,
        'parsers.conf': `
            [PARSER]
                Name        cri
                Format      regex
                Regex       ^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>[^ ]*) (?<log>.*)$
                Time_Key    time
                Time_Format %Y-%m-%dT%H:%M:%S.%L%z
        `
    }
};