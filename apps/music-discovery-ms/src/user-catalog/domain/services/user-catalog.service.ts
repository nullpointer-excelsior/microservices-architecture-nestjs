import { Injectable } from "@nestjs/common";
import { UserCatalogRepository } from "../repositories/user-catalog.repository";
import { UserCatalog } from "../model/user-catalog.model";
import { NotFoundExceptionIfUndefined, ValidateArgumentModel } from "@lib/utils/decorators";

@Injectable()
export class UserCatalogService {
    
    constructor(private readonly repository: UserCatalogRepository) {}

    @ValidateArgumentModel
    async create(userCatalog: UserCatalog) {
        this.repository.save(userCatalog);
    }

    @NotFoundExceptionIfUndefined('User catalog not found')
    async findByUserId(id: string) {
        return this.repository.findByUserId(id);
    }

    @NotFoundExceptionIfUndefined('User catalog not found')
    async findById(id: string) {
        return this.repository.findById(id);
    }

    @ValidateArgumentModel
    async save(userCatalog: UserCatalog) {
        this.repository.save(userCatalog);
    }

}