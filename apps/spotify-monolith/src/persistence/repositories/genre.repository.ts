import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../entities/Genre';

@Injectable()
export class GenreRepository {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  async findOne(id: string): Promise<Genre | undefined> {
    return await this.genreRepository.findOneBy({ id});
  }

  async create(genre: Genre): Promise<Genre> {
    return await this.genreRepository.save(genre);
  }

  async update(genre: Genre): Promise<Genre> {
    return await this.genreRepository.save(genre);
  }

  async delete(id: string): Promise<void> {
    await this.genreRepository.delete(id);
  }
}