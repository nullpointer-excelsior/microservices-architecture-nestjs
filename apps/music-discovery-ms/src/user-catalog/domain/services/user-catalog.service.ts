import { Injectable } from "@nestjs/common";
import { UserCatalogRepository } from "../repositories/user-catalog.repository";
import { UserCatalog } from "../model/user-catalog.model";
import { NotFoundExceptionIfUndefined, ValidateArgumentModel } from "@lib/utils/decorators";

@Injectable()
export class UserCatalogService {
    
    constructor(private readonly repository: UserCatalogRepository) {}

    @ValidateArgumentModel
    async create(userMusicCatalog: UserCatalog) {
        this.repository.save(userMusicCatalog);
    }

    @NotFoundExceptionIfUndefined('User catalog not found')
    async findByUserId(id: string) {
        return this.repository.findByUserId(id);
    }

    @ValidateArgumentModel
    async save(userCatalog: UserCatalog) {
        this.repository.save(userCatalog);
    }

}