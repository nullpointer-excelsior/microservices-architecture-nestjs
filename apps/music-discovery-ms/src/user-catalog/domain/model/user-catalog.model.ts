import { Model } from "@lib/utils/seedwork";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { Favorites } from "./favorites.model";
import { Playlist } from "./playlist.model";
import { User } from "./user.model";


export class UserCatalog extends Model {
    
    @ValidateNested()
    user: User
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Playlist)
    playlists: Playlist[];
    
    @ValidateNested()
    favorites: Favorites


    updatePlaylist(playlist: Playlist) {
        return Model.updateAndValidate(this, prev => {
            prev.playlists = [
                ...prev.playlists.filter(p => p.id !== playlist.id),
                playlist
            ];
            return prev;
        })
    }

    updateFavorites(favorites: Favorites) {
        return Model.updateAndValidate(this, prev => {
            prev.favorites = favorites;
            return prev;
        })
    }


}