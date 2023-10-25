import { Module } from '@nestjs/common';
import { ConsumerController } from './queue/controllers/consumer.controller';
import { AiRecommenderUseCases } from './services/ai-recommender.use-cases';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [AiRecommenderUseCases],
})
export class AiRecommenderMsModule {}
