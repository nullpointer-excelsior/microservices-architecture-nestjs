import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { IntegrationEventsModule } from '@lib/integration-events';

@Module({
    controllers:[
        UserController
    ],
    providers: [
        UserService
    ],
    imports:[
        IntegrationEventsModule
    ]
})
export class UsersModule {}
