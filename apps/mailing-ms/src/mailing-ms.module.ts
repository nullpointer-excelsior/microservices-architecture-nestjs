import { Module } from '@nestjs/common';
import { IntegrationController } from './integration-events/controllers/integration.controller';
import { EmailService } from './integration-events/services/email.service';
import { UserPurchasesModule } from './user-purchases/user-purchases.module';

@Module({
  imports: [UserPurchasesModule],
  controllers: [IntegrationController],
  providers: [EmailService],
})
export class MailingMsModule {}
