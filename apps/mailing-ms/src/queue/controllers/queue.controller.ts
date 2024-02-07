import { UserCreatedEvent } from '@lib/integration-events';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailService } from '../services/email.service';

@Controller()
export class QueueController {
  
  constructor(private readonly email: EmailService) {}

  @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
  onUserCreated(@Payload() data: UserCreatedEvent, @Ctx() context: RmqContext) {
    Logger.log(`Event received: ${data.name} from ${data.service}`, 'QueueController')
    this.email.notifyUserDetails(data);
  }

}
