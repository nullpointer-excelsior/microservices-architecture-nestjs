import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../entities/Artist';

@Injectable()
export class ArtistRepository {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    return await this.artistRepository.findOneBy({ id });
  }

  async create(artist: Artist): Promise<Artist> {
    return await this.artistRepository.save(artist);
  }

  async update(artist: Artist): Promise<Artist> {
    return await this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<void> {
    await this.artistRepository.delete(id);
  }
}