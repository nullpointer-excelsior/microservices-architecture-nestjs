import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PlaylistUseCases } from "../../application/playlist.use-cases";
import { PlaylistUpdatedEvent } from "../../../shared/domain-events/user-music-catalog/playlist-updated.event";

@Injectable()
export class DomainEventListener {

    constructor(private readonly playlist: PlaylistUseCases) {}
    
    @OnEvent('com.clonespotify.discovery.*')
    onEvents(event: any) {
        Logger.log(event, 'DomainEventListener')
    }

    @OnEvent(PlaylistUpdatedEvent.NAME)
    async onPlaylistCreated(event: PlaylistUpdatedEvent) {
        await this.playlist.create(event.payload)
    }

}