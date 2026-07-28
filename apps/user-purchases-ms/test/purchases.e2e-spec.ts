import { Controller, Get, Post, Body, Param, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakePurchaseApplication {
    private purchases: any[] = [];
    private nextId = 1;

    startPurchaseProccess = async (req: any) => {
        const id = String(this.nextId++);
        const purchase = {
            id,
            transactionId: 'tx-' + id,
            status: 'IN_PROGRESS',
            ...req,
        };
        this.purchases.push(purchase);
        return { id, transactionId: purchase.transactionId, status: purchase.status };
    };

    findAll = async () => this.purchases;
}

@Controller('purchases')
class TestPurchaseController {
    constructor(private readonly application: FakePurchaseApplication) {}

    @Post()
    createPurchaseProccess(@Body() req: any) {
        return this.application.startPurchaseProccess(req);
    }

    @Get()
    findAll() {
        return this.application.findAll();
    }
}

@Module({ controllers: [TestPurchaseController], providers: [FakePurchaseApplication] })
class TestModule {}

describe('User Purchases API (e2e)', () => {
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

    it('POST /purchases starts a purchase process and returns a transactionId', async () => {
        const res = await request(app.getHttpServer())
            .post('/purchases')
            .send({ customer: 'cust-1', lines: [{ sku: 'SKU-1', quantity: 2 }] })
            .expect(201);
        expect(res.body.transactionId).toBeDefined();
        expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('GET /purchases returns the list of purchases', async () => {
        await request(app.getHttpServer())
            .post('/purchases')
            .send({ customer: 'cust-1', lines: [] })
            .expect(201);

        const res = await request(app.getHttpServer()).get('/purchases').expect(200);
        expect(res.body).toHaveLength(1);
    });
});
