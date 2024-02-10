import { UserCreatedEvent } from "@lib/integration-events";
import { Model } from "@lib/utils/seedwork";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RedisContext } from "@nestjs/microservices";
import { UserCatalogUseCases } from "../../application/user-catalog.use-cases";

@Controller()
export class IntegrationController {

    constructor(private readonly catalog: UserCatalogUseCases) {}

    @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
    onUserCreated(@Payload() event: UserCreatedEvent, @Ctx() context: RedisContext) {
        Logger.log(`Event received: ${event.name} from ${event.service}`, 'IntegrationController')
        this.catalog.createMusicCatalog({
            id: Model.generateUUID(),
            user: {
                id: event.payload.id,
                username: event.payload.username
            }
        })
    }
}
