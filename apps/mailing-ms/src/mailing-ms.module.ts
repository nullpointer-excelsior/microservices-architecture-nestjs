import { Module } from '@nestjs/common';
import { QueueController } from './queue/controllers/queue.controller';
import { EmailService } from './queue/services/email.service';

@Module({
  imports: [],
  controllers: [QueueController],
  providers: [EmailService],
})
export class MailingMsModule {}
