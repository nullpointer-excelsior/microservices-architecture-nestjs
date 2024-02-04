import { UserCatalog } from "../model/user-catalog.model";

export abstract class UserCatalogRepository {
    abstract save(catalog: UserCatalog): Promise<any>;
    abstract findByUserId(id: string): Promise<UserCatalog>;
    abstract findById(id: string): Promise<UserCatalog>;
}