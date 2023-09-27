import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../../libs/shared/src';
import { StockController } from './stock/stock.controller';

@Module({
  imports: [SharedModule, HttpModule],
  controllers: [StockController],
})
export class StockMsModule {

}
