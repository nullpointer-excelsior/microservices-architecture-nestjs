import { OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Playlist } from "../../domain/model/playlist.model";

export class CreatePlaylistDto extends OmitType(Playlist, ['id'] as const) {
    @IsUUID()
    @IsNotEmpty()
    userId: string;
}