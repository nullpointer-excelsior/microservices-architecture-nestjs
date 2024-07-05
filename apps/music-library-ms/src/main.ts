import { NestFactory } from '@nestjs/core';
import { MusicLibraryMsModule } from './music-library-ms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';


async function bootstrap() {

  const app = await NestFactory.create(MusicLibraryMsModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Music library microservice')
    .setDescription('The Music library API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'catalog',
      url: process.env.GRPC_MUSIC_LIBRARY_URL,
      protoPath: join(__dirname, 'music-catalog.proto'),
    },
  })
  await app.startAllMicroservices()
  
  const port = process.env.MUSIC_LIBRARY_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Music library microservice listen on port: ${port}`, "Main")
  });

}

startOpenTelemetry({
  serviceName: "music-library-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new PgInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
