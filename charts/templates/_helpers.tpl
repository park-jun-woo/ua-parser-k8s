{{- define "uaparser.fullname" -}}
{{- if and .Release.Name (ne .Release.Name "uaparser") -}}
{{ .Release.Name }}-uaparser
{{- else -}}
uaparser
{{- end -}}
{{- end }}

{{- define "redis.fullname" -}}
{{- if and .Release.Name (ne .Release.Name "uaparser") -}}
{{ .Release.Name }}-redis-uaparser
{{- else -}}
redis-uaparser
{{- end -}}
{{- end }}

{{- define "uaparser.config" -}}
{{ include "uaparser.fullname" . }}-config
{{- end }}
