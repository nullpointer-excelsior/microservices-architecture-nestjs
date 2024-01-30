import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from "class-validator";
import { Model } from "../../../shared/seedwork/model";
import { Song } from "./song.model";


export class Playlist extends Model {
    
    @IsNotEmpty()
    name: string;
    
    @IsBoolean()
    isPublic: boolean;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    songs: Song[];


}