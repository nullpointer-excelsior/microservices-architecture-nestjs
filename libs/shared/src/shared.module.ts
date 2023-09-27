import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { InstrumentationModule } from './instrumentation/instrumentation.module';

@Module({
  imports: [LoggerModule, InstrumentationModule],
  exports: [InstrumentationModule]
})
export class SharedModule {}
