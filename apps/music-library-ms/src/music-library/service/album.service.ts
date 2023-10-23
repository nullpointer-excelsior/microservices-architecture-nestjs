import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../../shared/database/entities/album.entity';
import { Artist } from '../../shared/database/entities/artist.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';
import { AlbumCreatedEvent } from '../../shared/events/album-created.event';
import { CreateAlbumRequest } from '../dto/create-album.request';

@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private events: EventEmitter2
  ) { }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<Album> {
    return this.albumRepository.findOneBy({ id });
  }

  @NotFoundExceptionIfUndefined
  findByArtistId(artistId: string): Promise<Album[]> {
    return this.albumRepository.find({
      where: { artist: { id: artistId } },
    });
  }

  async create(album: CreateAlbumRequest) {

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

    this.events.emit('library.album.created', new AlbumCreatedEvent(
      albumCreated
    ))

    return albumCreated

  }

}