import { Module } from '@nestjs/common';
import { StoreMsController } from './store-ms.controller';
import { SharedModule } from '../../../libs/shared/src';

@Module({
  imports: [SharedModule,],
  controllers: [StoreMsController],
})
export class StoreMsModule {}
