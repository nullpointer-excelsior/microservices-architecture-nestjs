import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../entities/Album';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album | undefined> {
    return await this.albumRepository.findOneBy({ id });
  }

  async create(album: Album): Promise<Album> {
    return await this.albumRepository.save(album);
  }

  async update(album: Album): Promise<Album> {
    return await this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    await this.albumRepository.delete(id);
  }

  async findByArtistId(artistId: string): Promise<Album[]> {
    return await this.albumRepository.find({
      where: { artist: { id: artistId } },
    });
  }
}