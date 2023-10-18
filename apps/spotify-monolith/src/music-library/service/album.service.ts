import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../../shared/database/entities/album.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';

@Injectable()
export class AlbumService {

  constructor(@InjectRepository(Album) private repository: Repository<Album>) { }

  findAll(): Promise<Album[]> {
    return this.repository.find();
  }

  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<Album> {
    return this.repository.findOneBy({ id });
  }

  @NotFoundExceptionIfUndefined
  findByArtistId(artistId: string): Promise<Album[]> {
    return this.repository.find({
      where: { artist: { id: artistId } },
    });
  }

}