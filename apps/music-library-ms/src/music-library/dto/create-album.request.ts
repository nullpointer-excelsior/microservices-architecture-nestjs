import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AlbumModel } from "../model/album.model";

export class ArtistIdModel {

    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the artist' })
    artistId: string;

}

export class CreateAlbumRequest extends IntersectionType(
    OmitType(AlbumModel, ['id'] as const),
    ArtistIdModel
) { }