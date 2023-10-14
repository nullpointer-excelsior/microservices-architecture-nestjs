import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../../shared/database/entities/song.entity';
import { SongModel } from '../model/song.model';

@Injectable()
export class SongService {
    
    constructor(@InjectRepository(Song) private songRepository: Repository<Song>) { }

    async findAll(): Promise<SongModel[]> {
        return await this.songRepository.find();
    }

    async findById(id: string): Promise<SongModel | undefined> {
        return await this.songRepository.findOneBy({ id });
    }

    async update(song: Song): Promise<SongModel> {
        return await this.songRepository.save(song);
    }

    async findByArtistId(artistId: string): Promise<SongModel[]> {
        return await this.songRepository.find({
            where: { artist: { id: artistId } },
        });
    }

    async findByAlbumId(albumId: string): Promise<SongModel[]> {
        return await this.songRepository.find({
            where: { album: { id: albumId } },
        });
    }

    async findByGenre(genreId: string): Promise<SongModel[]> {
        return await this.songRepository.find({
            where: { genre: { id: genreId } },
        });
    }
}