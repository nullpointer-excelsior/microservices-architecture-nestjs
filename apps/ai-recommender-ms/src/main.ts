import { NestFactory } from '@nestjs/core';
import { AiRecommenderMsModule } from './ai-recommender-ms.module';
import { RabbitmqQueueModule } from '../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { SONG_RECOMMENDATION_QUEUE } from './constants';

const options = {
  credentials: {
    host: process.env.RABBITMQ_HOST,
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS,
    vhost: process.env.RABBITMQ_VHOST,
    port: 5672,
  },
  queue: {
    name: 'ai-recommendation-queue',
    deadLetter: {
      exchange: 'dlx',
      patterns: [SONG_RECOMMENDATION_QUEUE]
    }
  }
}

async function bootstrap() {
  const microserviceOptions = RabbitmqQueueModule.createWorkerMicroserviceOptions(options)
  const app = await NestFactory.createMicroservice(AiRecommenderMsModule, microserviceOptions);
  await app.listen();
}
bootstrap();
