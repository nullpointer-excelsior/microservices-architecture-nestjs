import { NestFactory } from '@nestjs/core';
import { MusicDiscoveryMsModule } from './music-discovery-ms.module';
import { RabbitmqQueueModule } from '../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(MusicDiscoveryMsModule);
  app.useGlobalPipes(new ValidationPipe())
  
  const config = new DocumentBuilder()
    .setTitle('Music discovery microservice')
    .setDescription('The Music discovery API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.MUSIC_DISCOVERY_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Music discovery microservice listen on port: ${port}`, "Main")
  });
  
  // Logger.log(`RabbitMQ Manager on http://localhost:15672/`, "RabbitmqQueueModule")

}
bootstrap();
