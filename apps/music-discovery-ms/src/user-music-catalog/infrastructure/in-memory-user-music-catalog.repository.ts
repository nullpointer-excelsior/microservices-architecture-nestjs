import { Injectable } from "@nestjs/common";
import { UserMusicCatalog } from "../domain/model/user-music-catalog.model";
import { UserMusicCatalogRepository } from "../domain/repositories/user-music-catalog.repository";

@Injectable()
export class InMemoryUserMusicCatalogRepository extends UserMusicCatalogRepository {

    private readonly userMusicCatalogs: UserMusicCatalog[] = [];

    async save(userMusicCatalog: UserMusicCatalog): Promise<void> {
        if (userMusicCatalog.id === userMusicCatalog.id) {
            const index = this.userMusicCatalogs.findIndex((userMusicCatalog) => userMusicCatalog.id === userMusicCatalog.id);
            this.userMusicCatalogs[index] = userMusicCatalog;
            return;
        }
        this.userMusicCatalogs.push(userMusicCatalog);
    }

    async findByUserId(userId: string): Promise<UserMusicCatalog | undefined> {
        return this.userMusicCatalogs.find((userMusicCatalog) => userMusicCatalog.username === userId);
    }

}