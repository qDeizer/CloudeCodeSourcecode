Tracing (OpenTelemetry)
=======================

This repository includes a lightweight, best-effort OpenTelemetry bootstrap at
`backend/agclaw_backend/tracing.py`. The initialization is optional and will
no-op if the OpenTelemetry packages are not installed.

Enable tracing locally:

1. Install the tracing packages into your backend environment:

```powershell
# from repository root
python -m pip install "opentelemetry-sdk>=1.18.0" "opentelemetry-exporter-otlp>=1.18.0" "opentelemetry-instrumentation-requests>=1.18.0"
```

2. Optionally configure an OTLP collector by setting `OTEL_EXPORTER_OTLP_ENDPOINT`:

```powershell
$env:OTEL_EXPORTER_OTLP_ENDPOINT = "http://localhost:4317"
# then run the backend as usual
python -m backend.agclaw_backend.http_api
```

If no OTLP endpoint is configured, a `ConsoleSpanExporter` is enabled by
default so spans will be printed to stdout for local debugging.

Notes:
- The bootstrap instruments outgoing HTTP requests made via `requests` so
  external provider calls will be visible in traces.
- The tracing initialization is intentionally tolerant: missing packages or
  misconfiguration won't stop the backend from running.
