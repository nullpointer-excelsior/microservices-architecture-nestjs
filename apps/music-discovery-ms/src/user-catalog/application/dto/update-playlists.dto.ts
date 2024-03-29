import { IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Playlist } from "../../domain/model/playlist.model";

export class UpdatePlaylistsDto {
    
    @IsUUID()
    @IsNotEmpty()
    userCatalogId: string;

    @ValidateNested({ each: true })
    playlist: Playlist;
    
}