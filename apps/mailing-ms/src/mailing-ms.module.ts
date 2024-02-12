import { Module } from '@nestjs/common';
import { IntegrationController } from './integration-events/controllers/integration.controller';
import { EmailService } from './integration-events/services/email.service';

@Module({
  imports: [],
  controllers: [IntegrationController],
  providers: [EmailService],
})
export class MailingMsModule {}
