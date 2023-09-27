import { Injectable } from "@nestjs/common";
import { MetricService } from "nestjs-otel";
import { Histogram, ValueType } from "@opentelemetry/api"

@Injectable()
export class CustomMetricsService {

    constructor(private metrics: MetricService) { }

    getDatabaseHistogram(): Histogram {
        return this.metrics.getHistogram('database-duration', {
            description: 'Database ms-example duration',
            unit: 'milliseconds',
            valueType: ValueType.INT,
        })
    }

    getDummyCounter() {
        return this.metrics.getCounter('dummy-counter', {
            description: 'Dummy counter for testing purposes',
        })
    }

}