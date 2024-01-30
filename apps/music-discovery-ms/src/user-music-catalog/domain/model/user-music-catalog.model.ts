import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Model } from "../../../shared/seedwork/model";
import { Favorites } from "./favorites.model";
import { Playlist } from "./playlist.model";


export class UserMusicCatalog extends Model {
    
    @IsUUID()
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    username: string;
    
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