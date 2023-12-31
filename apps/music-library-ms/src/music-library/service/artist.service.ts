import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../../shared/database/entities/artist.entity';
import { NotFoundExceptionIfUndefined } from '@lib/utils/decorators/not-found-exeption-if-undefined';
import { CreateArtistRequest } from '../dto/create-artist.request';
import { ArtistModel } from '../model/artist.model';
import { Span } from 'nestjs-otel';

@Injectable()
export class ArtistService {

    constructor(@InjectRepository(Artist) private repository: Repository<Artist>) { }

    @Span("ArtistService/findAll")
    findAll(): Promise<ArtistModel[]> {
        return this.repository.find();
    }

    @Span("ArtistService/findById")
    @NotFoundExceptionIfUndefined('Artist not found')
    findById(id: string): Promise<ArtistModel> {
        return this.repository.findOneBy({ id });
    }

    @Span("ArtistService/save")
    save(artist: CreateArtistRequest) {
        return this.repository.save(artist)
    }

    @Span("ArtistService/update")
    update(artist: ArtistModel) {
        return this.repository.save(artist)
    }

    @Span("ArtistService/delete")
    async delete(id: string) {
        await this.repository.delete(id)
    }

}