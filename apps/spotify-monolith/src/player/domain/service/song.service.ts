import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Song } from "../../../shared/database/entities/song.entity";

@Injectable()
export class SongService {
    
    constructor(@InjectRepository(Song) private repository: Repository<Song>) { }

    findByIds(ids: string[]): Promise<Song[]> {
        return this.repository.find({ 
            where: { 
                id: In(ids)
            } 
        })
    }

}