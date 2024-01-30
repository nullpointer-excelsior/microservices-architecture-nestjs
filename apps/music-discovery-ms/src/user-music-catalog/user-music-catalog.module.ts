import { Module } from '@nestjs/common';
import { UserMusicCatalogUseCases } from './application/user-music-catalog.use-cases';
import { UserMusicCatalogRepository } from './domain/repositories/user-music-catalog.repository';
import { UserMusicCatalogService } from './domain/services/user-music-catalog.service';
import { InMemoryUserMusicCatalogRepository } from './infrastructure/in-memory-user-music-catalog.repository';
import { UserMusicCatalogController } from './infrastructure/restful/user-music-catalog.controller';

@Module({
    imports: [],
    controllers: [
        UserMusicCatalogController
    ],
    providers: [
        UserMusicCatalogService,
        UserMusicCatalogUseCases,
        InMemoryUserMusicCatalogRepository,
        {
            provide: UserMusicCatalogRepository,
            useExisting: InMemoryUserMusicCatalogRepository
        }
    ],
})
export class UserMusicCatalogModule {}
