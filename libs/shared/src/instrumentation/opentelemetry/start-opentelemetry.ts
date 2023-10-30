import { Logger } from "@nestjs/common";
import { createSdk } from "./create-sdk";

type CreateSdkOptions = {
    serviceName: string
    serviceVersion: string,
    traceExporterOptions?: { url: string, headers?: any },
    metricExporterOptions?: { url: string, headers?: any },
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