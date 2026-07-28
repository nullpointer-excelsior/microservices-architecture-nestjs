import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EmailService } from './../src/integration-events/services/email.service';

@Controller()
class TestIntegrationController {
  constructor(private readonly email: EmailService) {}

  @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
  onUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    Logger.log(`Event received: ${data?.payload?.username} from ${data?.service}`, 'QueueController');
    this.email.notifyUserDetails(data);
  }
}

describe('MailingMs IntegrationController (e2e)', () => {
  let app: TestingModule;
  let emailSpy: jest.SpyInstance;
  let emailService: EmailService;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [TestIntegrationController],
      providers: [EmailService],
    }).compile();

    emailService = app.get(EmailService);
    emailSpy = jest.spyOn(emailService, 'notifyUserDetails').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    await app.close();
    emailSpy.mockRestore();
  });

  it('forwards the user-updated payload to the EmailService', () => {
    const controller = app.get(TestIntegrationController);
    const event = {
      service: 'accounts-ms',
      pattern: 'com.clonespotify.accounts.users.integration.user-updated',
      payload: {
        id: 'user-1',
        username: 'tester',
        email: 'tester@example.com',
      },
    };

    controller.onUserCreated(event, {} as RmqContext);

    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(event);
  });
});
