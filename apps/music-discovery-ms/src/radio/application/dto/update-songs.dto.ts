import { IsArray, ValidateNested } from "class-validator";
import { Song } from "../../domain/model/song.model";
import { Type } from "class-transformer";

export class UpdateSongsDTO {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    songs: Song[]

}