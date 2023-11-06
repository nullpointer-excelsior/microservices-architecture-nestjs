import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitmqMessage } from '../../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/RabbitmqMessage';
import { NewSongDataMessage } from '../../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/messages/new-song.message';

@Controller()
export class NewSongController {

    @MessagePattern('new-song')
    onNewSong(@Payload() data: RabbitmqMessage<NewSongDataMessage>, @Ctx() context: RmqContext) {
        Logger.log("data", data)
        Logger.log("ctx", context)
        console.log(`Pattern: ${context.getPattern()}`);

    }
}