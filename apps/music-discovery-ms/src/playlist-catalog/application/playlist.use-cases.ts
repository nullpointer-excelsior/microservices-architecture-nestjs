import { Injectable, Logger } from "@nestjs/common";
import { PlaylistService } from "../domain/services/playlist.service";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { Playlist } from "../domain/model/playlist.model";

@Injectable()
export class PlaylistUseCases {

    constructor(private readonly playlist: PlaylistService) {}

    create(dto: CreatePlaylistDto) {
        const playlist = Playlist.create({ name: dto.name, songs: dto.songs });
        this.playlist
            .create(playlist)
            .then(() => Logger.log(`Playlist ${playlist.name} created`));
    }

    findAll() {
        return this.playlist.findAll();
    }

}