import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { Album } from "./album.model";
import { Artist } from "./artist.model";
import { Song } from "./song.model";


export class Favorites {
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    songs: Song[];
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Artist)
    artists: Artist[];
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Album)
    albums: Album[];

}