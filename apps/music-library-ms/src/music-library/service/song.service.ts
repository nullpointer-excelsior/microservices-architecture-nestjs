import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Span } from 'nestjs-otel';
import { In, Repository } from 'typeorm';
import { NewSongDataMessage } from '../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/messages/new-song.message';
import { RabbitmqClient } from '../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/services/rabbitmq-client.service';
import { Album } from '../../shared/database/entities/album.entity';
import { Artist } from '../../shared/database/entities/artist.entity';
import { Genre } from '../../shared/database/entities/genre.entity';
import { Song } from '../../shared/database/entities/song.entity';
import { NotFoundExceptionIfUndefined } from '@lib/utils/decorators/not-found-exeption-if-undefined';
import { CreateSongRequest } from '../dto/create-song.request';
import { SongModel } from '../model/song.model';

@Injectable()
export class SongService {
    
    constructor(
        @InjectRepository(Song) private repository: Repository<Song>,
        @InjectRepository(Album) private albumRepository: Repository<Album>,
        @InjectRepository(Artist) private artistRepository: Repository<Artist>,
        @InjectRepository(Genre) private genreRepository: Repository<Genre>,
        private rabbitmqClient: RabbitmqClient,
    ) { }

    @Span("SongService/findAll")
    findAll(): Promise<SongModel[]> {
        return this.repository.find();
    }

    @Span("SongService/findById")
    @NotFoundExceptionIfUndefined('Song not found')
    findById(id: string): Promise<SongModel> {
        return this.repository.findOneBy({ id });
    }

    @Span("SongService/findByIdIn")
    @NotFoundExceptionIfUndefined('Song not found')
    findByIdIn(ids: string[]): Promise<SongModel[]> {
        return this.repository.find({ 
            where: {
                id: In(ids) 
            }
        });
    }

    @Span("SongService/save")
    async save(song: CreateSongRequest) {
        
        const album = await this.findEntityOrInvalidRequest('Invalid AlbumId', () => this.albumRepository.findOneBy({ id: song.albumId }))
        const genre = await this.findEntityOrInvalidRequest('Invalid GenreId', () => this.genreRepository.findOneBy({ id: song.genreId }))
        const artist = await this.findEntityOrInvalidRequest('Invalid ArtistId', () => this.artistRepository.findOneBy({ id: song.artistId }))

        const songSaved = await this.repository.save({
            album,
            genre,
            artist,
            duration: song.duration,
            plays: song.plays,
            title: song.title,
            video: song.video,
            storage: song.storage,
        })

        const message: NewSongDataMessage = {
            albumId: song.albumId,
            genreId: song.genreId,
            ...songSaved
        } 
        this.rabbitmqClient.emitTo('new-song', message)

        return songSaved
        
    }

    private async findEntityOrInvalidRequest<T>(message: string, callback: () => Promise<T>) {
        return callback().then(entity => {
            if (!entity) {
                throw new BadRequestException(message);
            }
            return entity;
        });
    }

    @Span("SongService/update")
    update(song: Song): Promise<SongModel> {
        return this.repository.save(song);
    }

    @Span("SongService/findByArtistId")
    findByArtistId(artistId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { artist: { id: artistId } },
        });
    }

    @Span("SongService/findByAlbumId")
    findByAlbumId(albumId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { album: { id: albumId } },
        });
    }

    @Span("SongService/findByGenreId")
    findByGenre(genreId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { genre: { id: genreId } },
        });
    }

}