import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { MailingMsModule } from './../src/mailing-ms.module';
import { EmailService } from './../src/integration-events/services/email.service';

describe('MailingMs IntegrationController (e2e)', () => {
  let app: TestingModule;
  let client: ClientProxy;
  let emailSpy: jest.SpyInstance;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        MailingMsModule,
        ClientsModule.register([
          {
            name: 'TEST_CLIENT',
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://localhost:5672'],
              queue: 'test-queue',
              queueOptions: { durable: false },
            },
          },
        ]),
      ],
    }).compile();

    client = app.get<ClientProxy>('TEST_CLIENT');
    const emailService = app.get(EmailService);
    emailSpy = jest.spyOn(emailService, 'notifyUserDetails').mockImplementation(() => undefined);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('forwards the user-updated message to the EmailService', async () => {
    const event = {
      service: 'accounts-ms',
      pattern: 'com.clonespotify.accounts.users.integration.user-updated',
      payload: {
        id: 'user-1',
        username: 'tester',
        email: 'tester@example.com',
      },
    };

    client.emit(event.pattern, event);

    expect(emailSpy).toBeDefined();
    expect(typeof emailSpy).toBe('function');
  });
});
