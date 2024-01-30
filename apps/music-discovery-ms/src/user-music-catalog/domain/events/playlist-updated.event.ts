import { DomainEvent } from "../../../shared/events/domain.event";
import { Playlist } from "../model/playlist.model";

export class PlaylistUpdatedEvent extends DomainEvent<Playlist> { 
    
    constructor(playlist: Playlist) {
        super('com.clonespotify.discovery.playlist.updated', playlist);
    }

}