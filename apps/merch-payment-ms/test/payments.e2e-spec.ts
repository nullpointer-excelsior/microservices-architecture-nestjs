import { Controller, Get, Post, Patch, Body, Param, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as request from 'supertest';

@Injectable()
class FakePaymentApplication {
    private payments: any[] = [];
    private nextId = 1;

    createPayment = async (dto: any) => {
        const payment = { id: String(this.nextId++), status: 'PENDING', ...dto };
        this.payments.push(payment);
        return payment;
    };

    updatePaymentStatus = async (dto: { id: string; status: string }) => {
        const payment = this.payments.find((p) => p.id === dto.id);
        if (!payment) {
            const err: any = new Error('Payment not found');
            err.status = 404;
            throw err;
        }
        payment.status = dto.status;
        return payment;
    };
}

@ApiTags('payments')
@Controller('payments')
class TestPaymentController {
    constructor(private readonly payment: FakePaymentApplication) {}

    @Post()
    createPayment(@Body() req: any) {
        return this.payment.createPayment(req);
    }

    @Patch('status')
    updatePaymentStatus(@Body() req: any) {
        return this.payment.updatePaymentStatus(req);
    }
}

@Module({ controllers: [TestPaymentController], providers: [FakePaymentApplication] })
class TestModule {}

describe('Merch Payments API (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TestModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('POST /payments creates a payment with PENDING status', async () => {
        const res = await request(app.getHttpServer())
            .post('/payments')
            .send({ orderId: 'order-1', amount: 100 })
            .expect(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.status).toBe('PENDING');
    });

    it('PATCH /payments/status updates an existing payment', async () => {
        const created = await request(app.getHttpServer())
            .post('/payments')
            .send({ orderId: 'order-2', amount: 200 })
            .expect(201);

        const res = await request(app.getHttpServer())
            .patch('/payments/status')
            .send({ id: created.body.id, status: 'COMPLETED' })
            .expect(200);
        expect(res.body.status).toBe('COMPLETED');
    });
});
