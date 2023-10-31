import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { CustomMetricsService } from './services/custom-metrics.service';

const opentelemetryModule = OpenTelemetryModule.forRoot() 

@Module({
    exports: [
        opentelemetryModule,
        CustomMetricsService
    ],
    providers: [
        CustomMetricsService
    ]
})
export class InstrumentationModule {

}

