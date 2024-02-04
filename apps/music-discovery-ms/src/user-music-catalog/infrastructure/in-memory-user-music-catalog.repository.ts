import { Injectable } from "@nestjs/common";
import { UserMusicCatalog } from "../domain/model/user-music-catalog.model";
import { UserMusicCatalogRepository } from "../domain/repositories/user-music-catalog.repository";

@Injectable()
export class InMemoryUserMusicCatalogRepository extends UserMusicCatalogRepository {

    private readonly data: UserMusicCatalog[] = [];

    async save(userMusicCatalog: UserMusicCatalog): Promise<void> {
        const index = this.data.findIndex((item) => item.userId === userMusicCatalog.userId);
        if (index !== -1) {
            this.data[index] = userMusicCatalog;
        } else {
            this.data.push(userMusicCatalog);
        }
    }

    async findByUserId(userId: string): Promise<UserMusicCatalog | undefined> {
        return this.data.find((userMusicCatalog) => userMusicCatalog.userId === userId);
    }

    async findById(id: string): Promise<UserMusicCatalog | undefined> {
        return this.data.find((userMusicCatalog) => userMusicCatalog.id === id);
    }

}