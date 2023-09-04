import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import opentelemetry from "@opentelemetry/api"
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Tracer } from "@opentelemetry/sdk-trace-node"


const SERVICE_NAME = "products-ms"
const SERVICE_VERSION = "1.0"


const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});


export const sdk = new NodeSDK({
  traceExporter,
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: SERVICE_VERSION,
  }),
});


process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit());
});


export const tracer: Tracer = opentelemetry.trace.getTracer(
  SERVICE_NAME,
  SERVICE_VERSION,
) as any

