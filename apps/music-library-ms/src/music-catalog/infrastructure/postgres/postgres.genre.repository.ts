import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Genre as GenreEntity } from "../../../shared/database/entities/genre.entity";
import { Genre } from "../../domain/models/genre.model";
import { GenreRepository } from "../../domain/repositories/genre.repository";

@Injectable()
export class PostgresGenreRepository extends GenreRepository {
    
    constructor(@InjectRepository(GenreEntity) private repository: Repository<GenreEntity>) {
        super()
    }

    findAll(): Promise<Genre[]> {
        return this.repository.find();
    }

    findById(id: string): Promise<Genre> {
        return this.repository.findOneBy({ id });
    }

}