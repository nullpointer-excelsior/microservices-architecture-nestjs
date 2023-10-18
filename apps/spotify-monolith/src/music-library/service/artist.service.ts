import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../shared/database/entities/artist.entity';
import { ArtistModel } from '../model/artist.model';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';

@Injectable()
export class ArtistService {

    constructor(@InjectRepository(Artist) private repository: Repository<Artist>) { }

    findAll(): Promise<ArtistModel[]> {
        return this.repository.find();
    }

    @NotFoundExceptionIfUndefined
    findById(id: string): Promise<ArtistModel> {
        return this.repository.findOneBy({ id });
    }

}