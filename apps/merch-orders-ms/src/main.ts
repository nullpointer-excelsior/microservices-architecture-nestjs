import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getUserPurchaseMicroserviceOptions } from '@lib/distributed-transactions/user-purchases';
import { MerchOrdersMsModule } from './merch-orders-ms.module';
import { getRedisOptions } from '../../../libs/distributed-transactions/src/user-purchases/orchestation-saga/transporters/pubsub/get-redis-options';

async function bootstrap() {
  const app = await NestFactory.create(MerchOrdersMsModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.connectMicroservice(getUserPurchaseMicroserviceOptions())
  app.connectMicroservice(getRedisOptions())
  
  const config = new DocumentBuilder()
    .setTitle('Merch Orders API')
    .setDescription('The Merch Orders description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.MERCH_ORDERS_MS_APP_PORT
  app.startAllMicroservices()
  await app.listen(port, () => {
    Logger.log(`Merch orders microservice listen on port: ${port}`, "Main")
  });
}
bootstrap();
