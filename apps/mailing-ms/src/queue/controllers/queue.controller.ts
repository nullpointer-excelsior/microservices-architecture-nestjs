import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewAlbumMessage } from '@lib/rabbitmq-queue/rabbitmq-queue/model/messages/new-album.message';
import { EmailService } from '../services/email.service';

@Controller()
export class QueueController {
  
  constructor(private readonly email: EmailService) {}

  @MessagePattern('new-album')
  onNewAlbum(@Payload() data: NewAlbumMessage, @Ctx() context: RmqContext) {
    this.email.notifyNewAlbum(data)
  }

}
