import { NestFactory } from '@nestjs/core';
import { StoreMsModule } from './store-ms.module';
import { InstrumentationModule } from '../../../libs/shared/src/instrumentation/instrumentation.module';

async function bootstrap() {

  const sdk = InstrumentationModule.createSdk({
    serviceName:"store-ms",
    serviceVersion: "1.0",
  })
  sdk.start()
  const app = await NestFactory.create(StoreMsModule);
  await app.listen(3002);
}
bootstrap();
