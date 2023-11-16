import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { RabbitmqMessage } from "libs/rabbitmq-queue/src/rabbitmq-queue/model/RabbitmqMessage";
import { NewSongDataMessage } from "../../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/messages/new-song.message";
import { RadioUseCase } from "../../../application/use-cases/radio.use-case";

@Controller()
export class SongController {

    constructor(private radioUseCases: RadioUseCase) {}

    @MessagePattern('new-song')
    onNewSong(@Payload() data: RabbitmqMessage<NewSongDataMessage>, @Ctx() context: RmqContext) {
        Logger.log("queue message", data)
        console.log(`Pattern: ${context.getPattern()}`);
        const song = data.data
        if (song.video) {
            Logger.log('add to new radio')
            this.radioUseCases.updateGenreRadio(song)
        }

    }
}