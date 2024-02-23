import { NestFactory } from '@nestjs/core';
import { MerchOrdersMsModule } from './merch-orders-ms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MerchOrdersMsModule);

  const config = new DocumentBuilder()
    .setTitle('Merch Orders API')
    .setDescription('The Merch Orders description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.MERCH_ORDERS_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Merch orders microservice listen on port: ${port}`, "Main")
  });
}
bootstrap();
