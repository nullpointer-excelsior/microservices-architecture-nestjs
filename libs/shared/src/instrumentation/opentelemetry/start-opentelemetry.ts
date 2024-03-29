import { Logger } from "@nestjs/common";
import { metrics } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { InstrumentationOption } from '@opentelemetry/instrumentation';
import { Resource } from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export type CreateSdkOptions = {
  serviceName: string
  serviceVersion: string,
  traceExporterOptions?: { url: string, headers?: any },
  metricExporterOptions?: { url: string, headers?: any },
  instrumentations?: InstrumentationOption[]
}

export function createSdk(options: CreateSdkOptions) {

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: options.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: options.serviceVersion,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'local-machine.spotify-clone'
  })

  const traceExporter = new OTLPTraceExporter(options.traceExporterOptions);

  const metricExporter = new OTLPMetricExporter(options.metricExporterOptions)

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: options.instrumentations as any
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30000, // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
  });

  const applicationMeterProvider = new MeterProvider({
    resource: resource,
  });

  applicationMeterProvider.addMetricReader(metricReader);
  // Set this MeterProvider to be global to the app being instrumented.
  metrics.setGlobalMeterProvider(applicationMeterProvider);

  return sdk
}

export function startOpenTelemetry(options: CreateSdkOptions) {

  const sdk = createSdk({
    ...options,
    metricExporterOptions: {
      url: process.env.OTLP_TRACE_EXPORTER_URL,
    },
  })

  const shutdownOtelSdk = () => {
    sdk
      .shutdown()
      .then(() => {
        Logger.log("OTEL SDK shut down successfully", "OpenTelemetrySdk")
        process.exit(0)
      })
      .catch(() => {
        Logger.log("OTEL SDK failed shut down", "OpenTelemetrySdk")
        process.exit(1)
      })
  }


  process.on("SIGTERM", () => shutdownOtelSdk())
  process.on("SIGINT", () => shutdownOtelSdk())

  sdk.start()
  Logger.log("OTEL SDK started successfully", "startTelemetry")

}