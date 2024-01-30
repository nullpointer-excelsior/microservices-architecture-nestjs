import { Injectable } from "@nestjs/common";
import { UserMusicCatalogRepository } from "../repositories/user-music-catalog.repository";
import { UserMusicCatalog } from "../model/user-music-catalog.model";
import { NotFoundExceptionIfUndefined, ValidateArgumentModel } from "@lib/utils/decorators";

@Injectable()
export class UserMusicCatalogService {
    
    constructor(private readonly repository: UserMusicCatalogRepository) {}

    @ValidateArgumentModel
    async create(userMusicCatalog: UserMusicCatalog) {
        this.repository.save(userMusicCatalog);
    }

    @NotFoundExceptionIfUndefined('User catalog not found')
    async findByUserId(id: string) {
        return this.repository.findByUserId(id);
    }

    @ValidateArgumentModel
    async save(userMusicCatalog: UserMusicCatalog) {
        this.repository.save(userMusicCatalog);
    }

}