import { OnEvent } from "@nestjs/event-emitter";
import { AlbumCreatedEvent } from "../../../shared/events/album-created.event";
import { Injectable, Logger } from "@nestjs/common";
import { RadioUseCases } from "../../application/radio.use-cases";

@Injectable()
export class NewAlbumListener {

    constructor(private radio: RadioUseCases) {}

    @OnEvent('library.album.created', { async: true })
    async onNewAlbum(event: AlbumCreatedEvent) {
        Logger.log('Adding New album to radio', event)
        await this.radio.createLatestAmazingAlbumsRadio(event.album)
    }

}