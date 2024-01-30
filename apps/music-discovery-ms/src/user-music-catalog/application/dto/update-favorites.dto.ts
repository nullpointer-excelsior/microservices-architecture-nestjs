import { IsUUID, IsNotEmpty, ValidateNested } from "class-validator";
import { Favorites } from "../../domain/model/favorites.model";

export class UpdateFavoritesDto {
    
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ValidateNested()
    favorites: Favorites;
    
}