import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Playlist } from "../../../shared/database/entities/playlist.entity";


@Injectable()
export class PlaylistService {

  constructor(@InjectRepository(Playlist) private repository: Repository<Playlist>) { }

  findByUserId(id: string): Promise<Playlist[]> {
    return this.repository.find({
      relations: {
        songs: true,
        user: false
      },
      where: {
        user: {
          id: id,
        }
      }
    });
  }

  save(playlist: Playlist): Promise<Playlist> {
    return this.repository.save(playlist);
  }

}