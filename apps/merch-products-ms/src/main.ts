import { NestFactory } from '@nestjs/core';
import { MerchProductsMsModule } from './merch-products-ms.module';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MerchProductsMsModule);

  const config = new DocumentBuilder()
    .setTitle('Merch Products API')
    .setDescription('The Merch Products API, provides the ability to manage artists merchandising')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.MERCH_PRODUCTS_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Merch products microservice listen on port: ${port}`, "Main")
  });
}

startOpenTelemetry({
  serviceName: "music-discovery-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
