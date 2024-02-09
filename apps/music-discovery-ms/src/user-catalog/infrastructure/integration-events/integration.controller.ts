import { UserCreatedEvent } from "@lib/integration-events";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class IntegrationController {

    @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
    onUserCreated(@Payload() data: UserCreatedEvent, @Ctx() context: RmqContext) {
        Logger.log(`Event received: ${data.name} from ${data.service}`, 'IntegrationController')
    }
}
