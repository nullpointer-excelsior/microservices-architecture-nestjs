import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../../shared/database/entities/song.entity';
import { SongModel } from '../model/song.model';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';
import { CreateSongRequest } from '../dto/create-song.request';
import { Album } from '../../shared/database/entities/album.entity';
import { Genre } from '../../shared/database/entities/genre.entity';
import { Artist } from '../../shared/database/entities/artist.entity';

@Injectable()
export class SongService {
    
    constructor(
        @InjectRepository(Song) private repository: Repository<Song>,
        @InjectRepository(Album) private albumRepository: Repository<Album>,
        @InjectRepository(Artist) private artistRepository: Repository<Artist>,
        @InjectRepository(Genre) private genreRepository: Repository<Genre>,
    ) { }

    findAll(): Promise<SongModel[]> {
        return this.repository.find();
    }

    @NotFoundExceptionIfUndefined
    findById(id: string): Promise<SongModel> {
        return this.repository.findOneBy({ id });
    }

    async create(song: CreateSongRequest) {
        const album = await this.albumRepository.findOneBy({ id: song.albumId })
        const genre = await this.genreRepository.findOneBy({ id: song.genreId })
        const artist = await this.artistRepository.findOneBy({ id: song.artistId })
        return this.repository.save({
            album,
            genre,
            artist,
            duration: song.duration,
            plays: 0,
            title: song.title,
            video: song.video
        })
    }

    update(song: Song): Promise<SongModel> {
        return this.repository.save(song);
    }

    findByArtistId(artistId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { artist: { id: artistId } },
        });
    }

    findByAlbumId(albumId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { album: { id: albumId } },
        });
    }

    findByGenre(genreId: string): Promise<SongModel[]> {
        return this.repository.find({
            where: { genre: { id: genreId } },
        });
    }

}