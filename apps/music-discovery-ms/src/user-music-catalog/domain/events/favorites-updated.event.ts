import { DomainEvent } from "../../../shared/events/domain.event";
import { UpdateFavoritesDto } from "../../application/dto/update-favorites.dto";


export class FavoritesUpdatedEvent extends DomainEvent<UpdateFavoritesDto> { 
    
    constructor(favorites: UpdateFavoritesDto) {
        super('com.clonespotify.discovery.favorites.updated', favorites);
    }

}