import opentelemetry from "@opentelemetry/api"

export function getTracer(name: string, version: string) {
    return opentelemetry.trace.getTracer(name, version)
}