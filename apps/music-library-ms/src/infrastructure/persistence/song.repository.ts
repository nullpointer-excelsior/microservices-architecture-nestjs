import { Injectable } from "@nestjs/common";
import { SongEntity } from "./song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SongRepository {

    constructor(@InjectRepository(SongEntity) private repository: Repository<SongEntity>) { }

    save(song: SongEntity) {
        this.repository.save(song)
    }

    findByContainsName(name: string) {
        return this.repository.createQueryBuilder('song')
            .andWhere('song.name LIKE :name', { name: `%${name}%` })
            .orWhere('song.artist LIKE :name', { name: `%${name}%` })
            .orWhere('song.album LIKE :name', { name: `%${name}%` })
            .getMany()
    }

    findByArtist(artist: string) {
        return this.repository.createQueryBuilder('song')
            .orWhere('song.artist = :artist', { artist })
            .getMany()
    }

    findArtistNames() {
        return this.repository.createQueryBuilder('song')
            .select('song.artist')
            .distinct(true)
            .getRawMany()
    }

}