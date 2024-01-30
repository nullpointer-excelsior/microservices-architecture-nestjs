import { OmitType } from "@nestjs/swagger";
import { Playlist } from "../../domain/model/playlist.model";

export class CreatePlaylistDto extends OmitType(Playlist, ['id'] as const) {}