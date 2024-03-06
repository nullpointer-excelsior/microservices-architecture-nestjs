import { NestFactory } from '@nestjs/core';
import { MerchPaymentMsModule } from './merch-payment-ms.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getUserPurchaseMicroserviceOptions } from '@lib/distributed-transactions/user-purchases';

async function bootstrap() {
  const app = await NestFactory.create(MerchPaymentMsModule);
  app.connectMicroservice(getUserPurchaseMicroserviceOptions())
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Merch Payments API')
    .setDescription('Payment microservice for artist merchs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.MERCH_PAYMENTS_MS_APP_PORT
  app.startAllMicroservices()
  await app.listen(port, () => {
    Logger.log(`Merch payment microservice listen on port: ${port}`, "Main")
  });
}
bootstrap();
