import { DomainEvent } from "../../../../../../libs/utils/src/seedwork/domain/events/domain.event";
import { UpdateFavoritesDto } from "../../../user-music-catalog/application/dto/update-favorites.dto";


export class FavoritesUpdatedEvent extends DomainEvent<UpdateFavoritesDto> { 
    
    constructor(favorites: UpdateFavoritesDto) {
        super(FavoritesUpdatedEvent.NAME, favorites);
    }

    static readonly NAME = 'com.clonespotify.discovery.user-music-catalog.domain.favorites-updated';

}