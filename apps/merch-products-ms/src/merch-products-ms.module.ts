import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule, 
    StockModule,
    ConfigModule.forRoot()
  ],
})
export class MerchProductsMsModule {}
