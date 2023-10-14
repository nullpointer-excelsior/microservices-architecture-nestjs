import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../shared/database/entities/artist.entity';
import { ArtistModel } from '../model/artist.model';

@Injectable()
export class ArtistService {

    constructor(@InjectRepository(Artist) private repository: Repository<Artist>) { }

    async findAll(): Promise<ArtistModel[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<ArtistModel | undefined> {
        return await this.repository.findOneBy({ id });
    }

}