import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../../shared/database/entities/genre.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';
import { CreateGenreRequest } from '../dto/create-genre.request';
import { GenreModel } from '../model/genre.model';
import { Span } from 'nestjs-otel';

@Injectable()
export class GenreService {
  
  constructor(@InjectRepository(Genre) private repository: Repository<Genre>) {}

  @Span("GenreService/findByAlbumId")
  findAll(): Promise<Genre[]> {
    return this.repository.find();
  }

  @Span("GenreService/findById")
  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<Genre> {
    return this.repository.findOneBy({ id});
  }

  @Span("GenreService/save")
  save(genre: CreateGenreRequest) {
    return this.repository.save(genre)
  }

  @Span("GenreService/update")
  update(genre: GenreModel) {
    return this.repository.save(genre)
  }

  @Span("GenreService/delete")
  delete(id: string){
    return this.repository.delete(id)
  }

}