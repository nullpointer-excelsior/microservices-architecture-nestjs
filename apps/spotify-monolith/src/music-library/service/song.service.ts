import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../../shared/database/entities/song.entity';
import { SongModel } from '../model/song.model';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';

@Injectable()
export class SongService {
    
    constructor(@InjectRepository(Song) private repository: Repository<Song>) { }

    findAll(): Promise<SongModel[]> {
        return this.repository.find();
    }

    @NotFoundExceptionIfUndefined
    findById(id: string): Promise<SongModel> {
        return this.repository.findOneBy({ id });
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