import { Injectable, Logger } from "@nestjs/common";
import { UserCatalog } from "../domain/model/user-catalog.model";
import { UserCatalogRepository } from "../domain/repositories/user-catalog.repository";

@Injectable()
export class InMemoryUserCatalogRepository extends UserCatalogRepository {

    private readonly data: UserCatalog[] = [];

    async save(userMusicCatalog: UserCatalog): Promise<void> {
        Logger.log(`Saving user music catalog for user: ${userMusicCatalog.user.username}`, 'InMemoryUserCatalogRepository');
        const index = this.data.findIndex((item) => item.id === userMusicCatalog.id);
        if (index !== -1) {
            this.data[index] = userMusicCatalog;
        } else {
            this.data.push(userMusicCatalog);
        }
    }

    async findByUserId(userId: string): Promise<UserCatalog | undefined> {
        return this.data.find((userMusicCatalog) => userMusicCatalog.user.id === userId);
    }

    async findById(id: string): Promise<UserCatalog | undefined> {
        return this.data.find((userMusicCatalog) => userMusicCatalog.id === id);
    }

}