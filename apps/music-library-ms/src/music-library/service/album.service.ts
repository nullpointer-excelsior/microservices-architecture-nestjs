import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Span } from 'nestjs-otel';
import { Repository } from 'typeorm';
import { Album } from '../../shared/database/entities/album.entity';
import { Artist } from '../../shared/database/entities/artist.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorators/not-found-exception-if-undefined';
import { CreateAlbumRequest } from '../dto/create-album.request';

@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>
  ) { }

  @Span("AlbumService/findAll")
  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  @Span("AlbumService/findById")
  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<Album> {
    return this.albumRepository.findOneBy({ id });
  }

  @Span("AlbumService/findByArtistId")
  @NotFoundExceptionIfUndefined
  findByArtistId(artistId: string): Promise<Album[]> {
    return this.albumRepository.find({
      where: { artist: { id: artistId } },
    });
  }

  @Span("AlbumService/save")
  async save(album: CreateAlbumRequest) {

    const artist = await this.artistRepository.findOneBy({ id: album.artistId })

    if (!artist) {
      throw new NotFoundException()
    }

    const albumCreated = await this.albumRepository.save({
      title: album.title,
      photo: album.photo,
      artist: artist,
      year: album.year,
    })

    return albumCreated

  }

}