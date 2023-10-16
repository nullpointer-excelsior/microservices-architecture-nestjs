import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Playlist } from "../../../../shared/database/entities/playlist.entity";
import { PlaylistEntity } from "../../../domain/entity/playlist";

@Injectable()
export class PlaylistPostgresRepository {

  constructor(@InjectRepository(Playlist) private playlistRepository: Repository<Playlist>) { }

  async findByUserId(id: string): Promise<PlaylistEntity[]> {
    return await this.playlistRepository.find({
      where: {
        user: {
          id: id,
        }
      }
    });
  }

  async save(playlist: Playlist): Promise<PlaylistEntity> {
    return await this.playlistRepository.save(playlist);
  }

}