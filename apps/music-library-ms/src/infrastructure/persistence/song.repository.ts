import { Injectable } from "@nestjs/common";
import { SongEntity } from "./song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SongRepository {

    constructor(@InjectRepository(SongEntity) private repository: Repository<SongEntity>) { }

    findByContainsName(name: string) {
        return this.repository.createQueryBuilder('song')
            .andWhere('song.name LIKE :name', { name: `%${name}%` })
            .orWhere('song.artist LIKE :name', { name: `%${name}%` })
            .orWhere('song.album LIKE :name', { name: `%${name}%` })
            .getMany()
    }

}