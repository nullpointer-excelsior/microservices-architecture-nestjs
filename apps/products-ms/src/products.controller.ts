import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.model';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('products')
export class ProductController {
  constructor(
    @InjectPinoLogger(ProductController.name) private readonly logger: PinoLogger,
    private readonly productService: ProductService,
  ) {}

  @Post()
  create(@Body() product: Product): Product {
    return this.productService.create(product);
  }

  @Get()
  findAll() {
    this.logger.info('get-all-products');
    return this.productService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.productService.delete(id);
  }
}
