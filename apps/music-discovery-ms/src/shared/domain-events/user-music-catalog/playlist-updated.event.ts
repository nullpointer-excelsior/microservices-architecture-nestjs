import { DomainEvent } from "../../../../../../libs/utils/src/seedwork/domain/events/domain.event";
import { Playlist } from "../../../user-music-catalog/domain/model/playlist.model";

export class PlaylistUpdatedEvent extends DomainEvent<Playlist> { 
    
    constructor(playlist: Playlist) {
        super(PlaylistUpdatedEvent.NAME, playlist);
    }

    static readonly NAME = 'com.clonespotify.discovery.user-music-catalog.domain.playlist-updated';
    
}