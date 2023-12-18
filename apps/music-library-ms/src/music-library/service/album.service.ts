import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Span } from 'nestjs-otel';
import { Repository } from 'typeorm';
import { Album } from '../../shared/database/entities/album.entity';
import { Artist } from '../../shared/database/entities/artist.entity';
import { CreateAlbumRequest } from '../dto/create-album.request';
import { AlbumModel } from '../model/album.model';
import { RabbitmqClient } from '@lib/rabbitmq-queue/rabbitmq-queue/services/rabbitmq-client.service';
import { NotFoundExceptionIfUndefined } from '@lib/utils/decorators/not-found-exeption-if-undefined';

@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private rabbitmqClient: RabbitmqClient,
  ) { }

  @Span("AlbumService/findAll")
  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  @Span("AlbumService/findById")
  @NotFoundExceptionIfUndefined('Album not found')
  findById(id: string): Promise<Album> {
    return this.albumRepository.findOneBy({ id });
  }

  @Span("AlbumService/findByArtistId")
  @NotFoundExceptionIfUndefined('Album not found')
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

    this.rabbitmqClient.emitTo('new-album', { 
      albumId: albumCreated.id,
      title: albumCreated.title
    })
    
    return albumCreated

  }

  @Span("AlbumService/update")
  update(album: AlbumModel) {
    return this.albumRepository.save(album)
  }

}