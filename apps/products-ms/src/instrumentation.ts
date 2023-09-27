import opentelemetry, { Counter, MetricOptions, Span, context, trace } from "@opentelemetry/api";
import { Tracer } from "@opentelemetry/sdk-trace-node";

const SERVICE_NAME = "products-ms"
const SERVICE_VERSION = "1.0"




export const getTracer = (): Tracer => opentelemetry.trace.getTracer(
  SERVICE_NAME,
  SERVICE_VERSION,
) as any

export const getMeter = () => opentelemetry.metrics.getMeter(
  SERVICE_NAME,
  SERVICE_VERSION,
);

export const getSpan = (): Span | undefined => {
  return trace.getSpan(context.active());
}

export type GenericMetric = Counter 
export const meterData: Map<string, GenericMetric> = new Map();


export function getOrCreateCounter(
  name: string,
  options: MetricOptions = {},
): Counter {
  if (meterData.has(name)) {
    return meterData.get(name) as Counter;
  }
  const meter = getMeter()
  const counter = meter.createCounter(name, options);
  meterData.set(name, counter);
  return counter;

}

export function getCounter(name: string, options?: MetricOptions) {
  return getOrCreateCounter(name, options);
}

export function Span(name: string, attributes?: Record<string, any>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
            
      getTracer().startActiveSpan(name, (span) => {
        if (attributes) {
          span.setAttributes({ ...attributes })
        }
        try {
          return originalMethod.apply(this, args);
        } catch (error) {
          // span.setStatus({ code: SpanStatus.})
        } finally {
          span.end()
        }
      })
    };

    return descriptor;
  };
}