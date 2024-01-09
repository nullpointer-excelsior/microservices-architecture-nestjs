import { Injectable } from "@nestjs/common";
import { SongRepository } from "../../domain/repositories/song.repository";
import { Song } from "../../domain/models/song.model";
import { Song as SongEntity } from "../../../shared/database/entities/song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

@Injectable()
export class PostgresSongRepository extends SongRepository {

    constructor(@InjectRepository(SongEntity) private repository: Repository<SongEntity>) { 
        super()
    }

    findAll(): Promise<Song[]> {
        return this.repository.find();
    }

    findById(id: string): Promise<Song> {
        return this.repository.findOneBy({ id });
    }

    findByIdIn(ids: string[]): Promise<Song[]> {
        return this.repository.find({
            where: {
                id: In(ids)
            }
        })
    }

    findByArtistId(artistId: string): Promise<Song[]> {
        return this.repository.find({
            where: {
                artist: {
                    id: artistId
                }
            }
        })
    }

    findByAlbumId(albumId: string): Promise<Song[]> {
        return this.repository.find({
            where: {
                album: {
                    id: albumId
                }
            }
        })
    }

    findByGenreId(genreId: string): Promise<Song[]> {
        return this.repository.find({
            where: {
                genre: {
                    id: genreId
                }
            }
        })
    }

}