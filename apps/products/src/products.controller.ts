import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  findAll(): Product[] {
    this.logger.info('get-all-products');
    return this.productService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Product {
    return this.productService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatedProduct: Product): Product {
    return this.productService.update(id, updatedProduct);
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.productService.delete(id);
  }
}
