import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Album as AlbumEntity } from "../../../shared/database/entities/album.entity";
import { Album } from "../../domain/models/album.model";
import { AlbumRepository } from "../../domain/repositories/album.repository";

@Injectable()
export class PostgresAlbumRepository extends AlbumRepository {

    constructor(@InjectRepository(AlbumEntity) private repository: Repository<AlbumEntity>) {
        super()
    }

    findAll(): Promise<Album[]> {
        return this.repository.find();
    }

    findById(id: string): Promise<Album> {
        return this.repository.findOneBy({ id });
    }

    findByArtistId(id: string): Promise<Album[]> {
        return this.repository.findBy({ artist: { id } });
    }

}