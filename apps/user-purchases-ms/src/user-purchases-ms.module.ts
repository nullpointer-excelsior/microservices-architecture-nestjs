import { Module } from '@nestjs/common';
import { PurchaseModule } from './purchase/purchase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PurchaseModule
  ],
  controllers: [],
  providers: [],
})
export class UserPurchasesMsModule {}
