import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Song } from "../../../../shared/database/entities/song.entity";
import { SongRepository } from "../../../domain/repository/SongRepository";

@Injectable()
export class SongPostgresRepository implements SongRepository {
    
    constructor(@InjectRepository(Song) private songRepository: Repository<Song>) { }

    findByIds(ids: string[]): Promise<Song[]> {
        return this.songRepository.find({ 
            where: { 
                id: In(ids)
            } 
        })
    }
}