import { getMicroserviceOptions } from '@lib/integration-events';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MusicDiscoveryMsModule } from './music-discovery-ms.module';

async function bootstrap() {
  
  const app = await NestFactory.create(MusicDiscoveryMsModule);
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(getMicroserviceOptions())

  const config = new DocumentBuilder()
    .setTitle('Music discovery microservice')
    .setDescription('The Music discovery API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.MUSIC_DISCOVERY_MS_APP_PORT
  await app.startAllMicroservices()
  await app.listen(port, () => {
    Logger.log(`Music discovery microservice listen on port: ${port}`, "Main")
    Logger.log(JSON.stringify(process.env), "Main")
  });
  
  // Logger.log(`RabbitMQ Manager on http://localhost:15672/`, "RabbitmqQueueModule")

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
