import { Module } from '@nestjs/common';
import { InMemoryPlaylistRepository } from './infrastructure/in-memory.playlist.repository';
import { PlaylistRepository } from './domain/repositories/playlist.repository';
import { PlaylistUseCases } from './application/playlist.use-cases';
import { PlaylistController } from './infrastructure/restful/playlist.controller';
import { PlaylistService } from './domain/services/playlist.service';
import { DomainEventListener } from './infrastructure/domain-events/domain-event.listener';

@Module({
    controllers: [
        PlaylistController
    ],
    providers: [
        PlaylistUseCases,
        PlaylistService,
        InMemoryPlaylistRepository,
        DomainEventListener,
        {
            provide: PlaylistRepository,
            useClass: InMemoryPlaylistRepository
        }
    ]
})
export class PlaylistsModule {}
