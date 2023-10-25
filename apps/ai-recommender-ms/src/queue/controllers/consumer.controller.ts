import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext, Transport } from '@nestjs/microservices';
import { SONG_RECOMMENDATION_QUEUE } from '../../constants';
import { RequestRecomendationMessage } from '../model/RequestRecomendationMessage';
import { RabbitmqMessage } from '../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/RabbitmqMessage';
import { AiRecommenderUseCases } from '../../services/ai-recommender.use-cases';

@Controller()
export class ConsumerController {

  constructor(private recommender: AiRecommenderUseCases) {}

  @EventPattern(SONG_RECOMMENDATION_QUEUE, Transport.RMQ)
  consumeSongRecommendationRequest(@Payload() message: RabbitmqMessage<RequestRecomendationMessage>, @Ctx() context: RmqContext) {
    try {
      this.recommender.getRecomendationBySong(message.data)
      context.getChannelRef().ack(context.getMessage())
    } catch (error) {
      console.error(error)
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
