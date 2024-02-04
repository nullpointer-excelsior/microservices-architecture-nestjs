import { DomainEvent } from "@lib/utils/seedwork";
import { UpdateFavoritesDto } from "../../../user-catalog/application/dto/update-favorites.dto";


export class FavoritesUpdatedEvent extends DomainEvent<UpdateFavoritesDto> { 
    
    constructor(favorites: UpdateFavoritesDto) {
        super(FavoritesUpdatedEvent.NAME, favorites);
    }

    static readonly NAME = 'com.clonespotify.discovery.user-music-catalog.domain.favorites-updated';

}