import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ProductsModule, 
    StockModule,
    ConfigModule.forRoot(),
    DeliveryModule
  ],
})
export class MerchProductsMsModule {}
