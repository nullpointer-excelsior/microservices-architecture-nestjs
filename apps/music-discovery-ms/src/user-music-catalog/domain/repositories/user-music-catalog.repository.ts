import { UserMusicCatalog } from "../model/user-music-catalog.model";

export abstract class UserMusicCatalogRepository {
    abstract save(userMusicCatalog: UserMusicCatalog): Promise<any>;
    abstract findByUserId(id: string): Promise<UserMusicCatalog>;
    abstract findById(id: string): Promise<UserMusicCatalog>;
}