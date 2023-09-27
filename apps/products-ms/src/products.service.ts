import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ProductRepository } from './product.repository';
import { Counter, Histogram, ValueType } from '@opentelemetry/api';
import { MetricService, Span, TraceService } from 'nestjs-otel';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { Stopwatch } from '../../../libs/shared/src/instrumentation/utils/Stopwatch';
import { CustomMetricsService } from '../../../libs/shared/src/instrumentation/services/custom-metrics.service';



@Injectable()
export class ProductService {

  private searchCounter: Counter
  private stockTimeHistogram: Histogram
  private databaseTimeHistogram: Histogram
  private dummyCounter: Counter


  constructor(
    @InjectPinoLogger(ProductService.name) private readonly logger: PinoLogger, 
    private repository: ProductRepository,
    private readonly traceService: TraceService,
    private readonly metricService: MetricService,
    private readonly customMetricsService: CustomMetricsService,
    private readonly http: HttpService
  ) {
    this.searchCounter = this.metricService.getCounter('search-counter2', {
      description: "Search products count"
    })
    this.stockTimeHistogram = this.metricService.getHistogram('stock-time', {
      description: 'Time duration for stock-api',
      unit: 'milliseconds',
      valueType: ValueType.INT,
    })
    // this.databaseTimeHistogram = this.metricService.getHistogram('product-database-time', {
    //   description: 'time duration for product database searchs',
    //   unit: 'milliseconds',
    //   valueType: ValueType.INT,
    // })

    this.databaseTimeHistogram = this.customMetricsService.getDatabaseHistogram()
    this.dummyCounter = this.customMetricsService.getDummyCounter()
  }

  create(product: Product): Product {
    const p = this.repository.create(product)
    
    return {
      ...p,
      stock: 0
    }
  }

  @Span('find-products')
  async findAll(): Promise<Product[]> {
    
    this.logger.info('getting all products', 'p-1');
    this.searchCounter.add(1)
    this.dummyCounter.add(1)

    const stockStopwatch = Stopwatch.createAndInit()
    
    const stock = await lastValueFrom(this.http.get('http://localhost:3001/stock/product').pipe(
      map(r => r.data.stock)
    ))
    
    this.stockTimeHistogram.record(stockStopwatch.stop(), { stockAvailable: stock })

    const dbStopwatch = Stopwatch.createAndInit()
    
    const products =  this.repository.findAll().map(p =>({ ...p, stock: stock }))
    
    this.databaseTimeHistogram.record(dbStopwatch.stop(), { productsFound: products.length })
    
    return products

  }

  delete(id: number): void {
    this.repository.delete(id)
  }
}
