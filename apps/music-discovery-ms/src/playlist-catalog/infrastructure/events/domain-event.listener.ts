import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PlaylistUseCases } from "../../application/playlist.use-cases";
import { PlaylistUpdatedEvent } from "../../../shared/domain-events/user-music-catalog/playlist-updated.event";

@Injectable()
export class DomainEventListener {

    constructor(private readonly playlist: PlaylistUseCases) {}
    
    @OnEvent('com.clonespotify.discovery.**')
    onEvents(event: any) {
        Logger.log(event, 'DomainEventListener')
    }

    @OnEvent(PlaylistUpdatedEvent.NAME)
    async onPlaylistCreated(event: PlaylistUpdatedEvent) {
        Logger.log(event, 'PlaylistUpdatedEvent')
        const playlist = event.payload
        if (playlist.isPublic) {
            await this.playlist.create(playlist)
        }
    }

}