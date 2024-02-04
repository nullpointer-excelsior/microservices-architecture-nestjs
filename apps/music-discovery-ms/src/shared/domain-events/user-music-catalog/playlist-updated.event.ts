import { DomainEvent } from "@lib/utils/seedwork";
import { Playlist } from "../../../playlist-catalog/domain/model/playlist.model";

export class PlaylistUpdatedEvent extends DomainEvent<Playlist> { 
    
    constructor(playlist: Playlist) {
        super(PlaylistUpdatedEvent.NAME, playlist);
    }

    static readonly NAME = 'com.clonespotify.discovery.user-music-catalog.domain.playlist-updated';
    
}