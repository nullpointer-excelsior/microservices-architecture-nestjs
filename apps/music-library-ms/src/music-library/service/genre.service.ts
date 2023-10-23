import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../../shared/database/entities/genre.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';
import { CreateGenreRequest } from '../dto/create-genre.request';
import { GenreModel } from '../model/genre.model';

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

  save(genre: CreateGenreRequest) {
    return this.repository.save(genre)
  }

  update(genre: GenreModel) {
    return this.repository.save(genre)
  }

  delete(id: string){
    return this.repository.delete(id)
  }

}