import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SongModel } from "../model/song.model";

export class ArtistIdModel {

    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the album' })
    albumId: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the genre' })
    genreId: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the artist' })
    artistId: string;

}

export class CreateSongRequest extends IntersectionType(
    OmitType(SongModel, ['id'] as const),
    ArtistIdModel
) { }