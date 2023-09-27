import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { SharedModule } from '../../../libs/shared/src';
import { ProductRepository } from './product.repository';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    SharedModule,
    HttpModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductsModule  {

}
