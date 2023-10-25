import { Injectable } from '@nestjs/common';
import { RequestRecomendationMessage } from '../queue/model/RequestRecomendationMessage';
import { ResponseRecomendationMessage } from '../queue/model/ResponseRecomendationMessage';

@Injectable()
export class AiRecommenderUseCases {
  
  getRecomendationBySong(message: RequestRecomendationMessage): ResponseRecomendationMessage {
    console.log(message)
    return []
  }
}
