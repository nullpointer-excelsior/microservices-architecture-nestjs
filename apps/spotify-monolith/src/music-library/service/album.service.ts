import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../../shared/database/entities/album.entity';
import { NotFoundExceptionIfUndefined } from '../decorator/not-found-exception-if-indefined';

@Injectable()
export class AlbumService {
  
  constructor(@InjectRepository(Album) private albumRepository: Repository<Album>) { }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  @NotFoundExceptionIfUndefined
  async findById(id: string): Promise<Album> {
    return await this.albumRepository.findOneBy({ id });
  }

  async findByArtistId(artistId: string): Promise<Album[]> {
    return await this.albumRepository.find({
      where: { artist: { id: artistId } },
    });
  }

}