import { Injectable, Logger } from '@nestjs/common';
import { NewAlbumMessage } from '@lib/rabbitmq-queue/rabbitmq-queue/model/messages/new-album.message';

@Injectable()
export class EmailService {
  
  notifyNewAlbum(message: NewAlbumMessage ) {
    Logger.log(`Sending email ${message.data.title} album recomendation`, 'EmailService')
  }
  
}
