import { Logger } from "@nestjs/common"
import { NodeSDK } from "@opentelemetry/sdk-node"

export function shutdownOTelSdk(sdk: NodeSDK) {
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