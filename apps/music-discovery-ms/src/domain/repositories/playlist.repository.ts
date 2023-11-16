import { Injectable } from "@nestjs/common";
import { Playlist } from "../model/playlist";

@Injectable()
export class PlaylistRepository {

    data: any[]

    save(playlist: Playlist) {
        console.log("Playlist saved", playlist)
    }

    findByName(name: string) {
        console.log('findByName', name)
        return this.data[0] as Promise<Playlist>
    }

}