import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ProductRepository } from './product.repository';
import { tracer } from './tracing';


@Injectable()
export class ProductService {

  constructor(
    @InjectPinoLogger(ProductService.name) private readonly logger: PinoLogger, 
    private repository: ProductRepository
  ) {}

  create(product: Product): Product {
    return this.repository.create(product)
  }

  findAll(): Product[] {
    this.logger.info('getting all products', 'p-1');

    return tracer.startActiveSpan('products-service.findAll()', (span) => {
      span.setAttributes({
        'component-service': 'ProductService',
        'use-case': 'findAll',
      })
      
      const products =  this.repository.findAll()
      span.end()
      return products
    })
  
  }

  findById(id: number): Product {
    return this.repository.findAll()[id];
  }

  update(id: number, updatedProduct: Product): Product {
    return this.repository.update(id, updatedProduct)
  }

  delete(id: number): void {
    this.repository.delete(id)
  }
}
