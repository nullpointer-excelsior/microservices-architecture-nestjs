import { Injectable, Logger } from '@nestjs/common';
import { UserCreatedEvent } from '@lib/integration-events';

@Injectable()
export class EmailService {
  
  notifyUserDetails(userCreated: UserCreatedEvent) {
    Logger.log(`Sending email to ${userCreated.payload.email} with user details.`, 'EmailService')
  }
  
}
