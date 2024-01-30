import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PlaylistUseCases } from "../../application/playlist.use-cases";
import { PlaylistUpdatedEvent } from "../../../user-music-catalog/domain/events/playlist-updated.event";

@Injectable()
export class DomainEventListener {

    constructor(private readonly playlist: PlaylistUseCases) {}
    
    @OnEvent('com.clonespotify.discovery.*')
    onEvents(event: any) {
        Logger.log(event, 'DomainEventListener')
    }

    @OnEvent('com.clonespotify.discovery.playlist.created')
    onPlaylistCreated(event: PlaylistUpdatedEvent) {
        
    }

}