import { Logger } from "@nestjs/common";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ExpressInstrumentation, ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader, MeterProvider } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { metrics } from '@opentelemetry/api';
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

type CreateSdkOptions = {
    serviceName: string
    serviceVersion: string,
    traceExporterOptions?: { url: string, headers?: any },
    metricExporterOptions?: { url: string, headers?: any },
}

export function createSdk(options: CreateSdkOptions){
    
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
      instrumentations: [
          new HttpInstrumentation(),
          new ExpressInstrumentation({
              ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
          }),
      ],
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
    
    const sdk = createSdk(options)
    
    const shutdownOtelSdk = () => {
        sdk 
          .shutdown()
          .then(() => {
            Logger.log("OTEL SDK shut down successfully", "OpenTelemetrySdk")
            process.exit(0)
          })
          .catch(() => {
            Logger.log("OTEL SDK shut down successfully", "OpenTelemetrySdk")
            process.exit(1)
          })
    }

    
    process.on("SIGTERM", () => shutdownOtelSdk())
    process.on("SIGINT", () => shutdownOtelSdk())   
    
    sdk.start()
    Logger.log("OTEL SDK started successfully", "startTelemetry")

}