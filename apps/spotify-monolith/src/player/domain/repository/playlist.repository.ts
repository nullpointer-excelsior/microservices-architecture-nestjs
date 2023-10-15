import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Playlist } from "../../../shared/database/entities/playlist.entity";

@Injectable()
export class PlaylistRepository {

  constructor(@InjectRepository(Playlist) private playlistRepository: Repository<Playlist>) { }

  // async findAll(): Promise<Playlist[]> {
  //   return await this.playlistRepository.find();
  // }

  // async findById(id: string): Promise<Playlist | undefined> {
  //   return await this.playlistRepository.findOneBy({ id });
  // }

  // async findByUserId(id: string): Promise<Playlist[]> {
  //   return await this.playlistRepository.find({ where: {
  //     user: {
  //       id: id,
  //     }
  //   }});
  // }

  async create(playlist: Playlist): Promise<Playlist> {
    return await this.playlistRepository.save(playlist);
  }

  // async update(playlist: Playlist): Promise<Playlist> {
  //   return await this.playlistRepository.save(playlist);
  // }

  // async delete(id: string): Promise<void> {
  //   await this.playlistRepository.delete(id);
  // }
}