import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Song } from "../../../shared/database/entities/song.entity";

@Injectable()
export class SongRepository {
    
    constructor(@InjectRepository(Song) private songRepository: Repository<Song>) { }

    findByIds(ids: string[]): Promise<Song[]> {
        return this.songRepository.find({ 
            where: { 
                id: In(ids)
            } 
        })
    }
}