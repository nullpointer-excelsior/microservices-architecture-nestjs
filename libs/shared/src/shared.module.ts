import { Module } from '@nestjs/common';
import { InstrumentationModule } from './instrumentation/instrumentation.module';

@Module({
  imports: [InstrumentationModule],
  exports: [InstrumentationModule]
})
export class SharedModule {}
