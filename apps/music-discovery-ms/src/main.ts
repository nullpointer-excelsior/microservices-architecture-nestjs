import { NestFactory } from '@nestjs/core';
import { MusicDiscoveryMsModule } from './music-discovery-ms.module';
import { RabbitmqQueueModule } from '../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.createMicroservice(MusicDiscoveryMsModule, RabbitmqQueueModule.getMicroserviceOptions());
  await app.listen();
  
  Logger.log(`RabbitMQ Manager on http://localhost:15672/`, "RabbitmqQueueModule")

}
bootstrap();
