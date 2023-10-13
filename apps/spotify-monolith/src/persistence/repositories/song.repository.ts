import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../entities/Song';

@Injectable()
export class SongRepository {
    
    constructor(@InjectRepository(Song) private songRepository: Repository<Song>) { }

    async findAll(): Promise<Song[]> {
        return await this.songRepository.find();
    }

    async findOne(id: string): Promise<Song | undefined> {
        return await this.songRepository.findOneBy({ id });
    }

    async create(song: Song): Promise<Song> {
        return await this.songRepository.save(song);
    }

    async update(song: Song): Promise<Song> {
        return await this.songRepository.save(song);
    }

    async delete(id: string): Promise<void> {
        await this.songRepository.delete(id);
    }

    async findByArtistId(artistId: string): Promise<Song[]> {
        return await this.songRepository.find({
            where: { artist: { id: artistId } },
        });
    }

    async findByAlbum(albumId: string): Promise<Song[]> {
        return await this.songRepository.find({
            where: { album: { id: albumId } },
        });
    }

    async findByGenre(genreId: string): Promise<Song[]> {
        return await this.songRepository.find({
            where: { genre: { id: genreId } },
        });
    }
}