import { UserCreatedEvent } from "@lib/integration-events";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { UserCatalogUseCases } from "../../application/user-catalog.use-cases";

@Controller()
export class IntegrationController {

    constructor(private readonly catalog: UserCatalogUseCases) {}

    @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
    onUserCreated(@Payload() event: UserCreatedEvent, @Ctx() context: RmqContext) {
        Logger.log(`Event received: ${event.name} from ${event.service}`, 'IntegrationController')
        this.catalog.createMusicCatalog({
            userId: event.payload.id,
            username: event.payload.username
        })
    }
}
