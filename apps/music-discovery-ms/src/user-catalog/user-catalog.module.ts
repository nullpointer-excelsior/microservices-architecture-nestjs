import { Module } from '@nestjs/common';
import { UserCatalogUseCases } from './application/user-catalog.use-cases';
import { UserCatalogRepository } from './domain/repositories/user-catalog.repository';
import { UserCatalogService } from './domain/services/user-catalog.service';
import { InMemoryUserCatalogRepository } from './infrastructure/in-memory-user-catalog.repository';
import { UserCatalogController } from './infrastructure/restful/user-catalog.controller';
import { IntegrationController } from './infrastructure/integration-events/integration.controller';

@Module({
    imports: [],
    controllers: [
        UserCatalogController,
        IntegrationController
    ],
    providers: [
        UserCatalogService,
        UserCatalogUseCases,
        InMemoryUserCatalogRepository,
        {
            provide: UserCatalogRepository,
            useExisting: InMemoryUserCatalogRepository
        }
    ],
})
export class UserCatalogModule {}
