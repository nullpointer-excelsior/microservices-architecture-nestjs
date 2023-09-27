import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { OpenTelemetryModule } from 'nestjs-otel';
import { instrumentationConfigRepository } from './opentelemetry/instrumentation-config.repository';
import { getTracer } from './opentelemetry/get-tracer';
import { InternalAxiosRequestConfigWithSpan, injectFromResponse, setPropagation } from './axios/http.interceptors';
import { createSdk } from './opentelemetry/create-sdk';
import { CustomMetricsService } from './services/custom-metrics.service';

interface InstrumentationOptions {
    serviceName: string
    serviceVersion: string,
    traceExporterOptions?: { url: string, headers?: any },
    metricExporterOptions?: { url: string, headers?: any },
}

const opentelemetryModule = OpenTelemetryModule.forRoot() 

const httpModule = HttpModule.register({})

@Module({
    imports: [opentelemetryModule, httpModule],
    exports: [opentelemetryModule, httpModule, CustomMetricsService],
    providers: [
        CustomMetricsService
    ]
})
export class InstrumentationModule implements OnApplicationBootstrap {

    constructor(private readonly http: HttpService) {}
    
    onApplicationBootstrap() {

        const setPropagationInterceptor = (config: InternalAxiosRequestConfigWithSpan) => {
            const tracer = InstrumentationModule.getTracer()
            return setPropagation(tracer, config)
        }
    
        this.http.axiosRef.interceptors.request.use(setPropagationInterceptor)
        this.http.axiosRef.interceptors.response.use(injectFromResponse)

    }

    static createSdk(options: InstrumentationOptions) {
        console.log(`Instrumentation for ${options.serviceName} module starting...`)
        const sdk = createSdk({ 
            ...options
        })

        instrumentationConfigRepository.save({
            serviceName: options.serviceName, 
            serviceVersion: options.serviceVersion 
        })

        process.on('SIGTERM', () => {
            sdk
                .shutdown()
                .then(() => console.log('Tracing terminated'))
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit());
        });
    
        process.on('SIGINT', () => {
            sdk
                .shutdown()
                .then(() => console.log('Tracing terminated'))
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit());
        });

        return sdk

    }

    static getTracer() {
        const resource = instrumentationConfigRepository.getResourceConfig()
        return getTracer(resource.service, resource.version)
    }
}

