import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Playlist } from "../../../shared/database/entities/playlist.entity";


@Injectable()
export class PlaylistRepository {

  constructor(@InjectRepository(Playlist) private playlistRepository: Repository<Playlist>) { }

  async findByUserId(id: string): Promise<Playlist[]> {
    return await this.playlistRepository.find({
      relations: {
        songs: true
      },
      where: {
        user: {
          id: id,
        }
      }
    });
  }

  async save(playlist: Playlist): Promise<Playlist> {
    return await this.playlistRepository.save(playlist);
  }

}