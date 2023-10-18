import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../../shared/database/entities/genre.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';

@Injectable()
export class GenreService {
  
  constructor(@InjectRepository(Genre) private repository: Repository<Genre>) {}

  findAll(): Promise<Genre[]> {
    return this.repository.find();
  }

  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<Genre> {
    return this.repository.findOneBy({ id});
  }

}