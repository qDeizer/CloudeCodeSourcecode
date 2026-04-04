"""Basic OpenTelemetry tracing bootstrap for the AG-Claw backend.

This module performs a safe, best-effort initialization: if OpenTelemetry
packages aren't installed or configuration is missing, it quietly no-ops so
tests and local runs keep working without extra setup.

Enable an OTLP collector by setting `OTEL_EXPORTER_OTLP_ENDPOINT` (or the
standard OTEL env vars). A ConsoleSpanExporter is added for local visibility.
"""
from __future__ import annotations

import logging
import os
from typing import Optional


def start_tracing(service_name: str = "agclaw-backend") -> Optional[object]:
    try:
        from opentelemetry import trace
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
        from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
        from opentelemetry.instrumentation.requests import RequestsInstrumentor
    except Exception as exc:  # pragma: no cover - optional dependency
        logging.getLogger(__name__).debug("OpenTelemetry not available: %s", exc)
        return None

    resource = Resource.create({"service.name": service_name})
    provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(provider)

    # Console exporter for local debugging/visibility
    provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))

    # If an OTLP endpoint is configured, attempt to wire an OTLP exporter
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    if otlp_endpoint:
        try:
            otlp = OTLPSpanExporter()
            provider.add_span_processor(BatchSpanProcessor(otlp))
        except Exception:
            logging.getLogger(__name__).exception("Failed to configure OTLP exporter")

    # Instrument the requests library so outgoing HTTP calls are traced
    try:
        RequestsInstrumentor().instrument()
    except Exception:
        logging.getLogger(__name__).debug("Failed to instrument requests library")

    logging.getLogger(__name__).info("Tracing initialized for %s", service_name)
    return provider
