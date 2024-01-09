import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Artist as ArtistEntity } from "../../../shared/database/entities/artist.entity";
import { Artist } from "../../domain/models/artist.model";
import { ArtistRepository } from "../../domain/repositories/artist.repository";

@Injectable()
export class PostgresArtistRepository extends ArtistRepository {
    
    constructor(@InjectRepository(ArtistEntity) private repository: Repository<ArtistEntity>) { 
        super()
    }

    findAll(): Promise<Artist[]> {
        return this.repository.find();
    }

    findById(id: string): Promise<Artist> {
        return this.repository.findOneBy({ id });
    }

}