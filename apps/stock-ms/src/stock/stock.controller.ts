import { Controller, Get } from '@nestjs/common';
import { MetricService, Span } from 'nestjs-otel';
import { Counter, Histogram } from '@opentelemetry/api';
import { CustomMetricsService } from '../../../../libs/shared/src/instrumentation/services/custom-metrics.service';

@Controller('stock')
export class StockController {

    stockCounter: Counter
    histogram: Histogram
    dummyCounter: Counter

    constructor(private readonly metricService: MetricService, private customMetricService: CustomMetricsService){
        this.stockCounter = this.metricService.getCounter('stock-quantity-counter', {
            description: "counter for stock"
        })
        this.histogram = this.metricService.getHistogram('stock-histogram',  {
            description: 'stock time duration'
        })
        this.dummyCounter = this.customMetricService.getDummyCounter()
    }

    @Get('/product')
    @Span('get-stock-product')
    getStock() {
        const stock = Math.trunc(Math.random()* 100)
        this.stockCounter.add(stock)
        this.dummyCounter.add(stock)
        this.histogram.record(20)
        return {
            productId: 27,
            stock
        }
    }
}
