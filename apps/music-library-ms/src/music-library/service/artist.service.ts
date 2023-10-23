import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../shared/database/entities/artist.entity';
import { NotFoundExceptionIfUndefined } from '../../shared/decorator/not-found-exception-if-undefined';
import { CreateArtistRequest } from '../dto/create-artist.request';
import { ArtistModel } from '../model/artist.model';

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

    save(artist: CreateArtistRequest) {
        return this.repository.save(artist)
    }

    update(artist: ArtistModel) {
        return this.repository.save(artist)
    }

    delete(id: string) {
        return this.repository.delete(id)
    }

}