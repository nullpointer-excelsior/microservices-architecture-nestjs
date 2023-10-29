import { NestFactory } from '@nestjs/core';
import { MobileBffModule } from './mobile-bff.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MobileBffModule);
  const port = +process.env.MOBILE_BFF_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Mobile BFF listen on port: ${port}`, "Main")
  });
}
bootstrap();
