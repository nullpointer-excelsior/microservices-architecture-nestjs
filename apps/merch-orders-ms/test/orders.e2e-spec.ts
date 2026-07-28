import { Controller, Get, Post, Patch, Body, Param, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakeOrderApplication {
    private orders: any[] = [];
    private nextId = 1;

    createOrder = async (dto: any) => {
        const order = { id: String(this.nextId++), status: 'CREATED', ...dto };
        this.orders.push(order);
        return order;
    };

    updateOrderStatus = async (dto: { id: string; status: string }) => {
        const order = this.orders.find((o) => o.id === dto.id);
        if (!order) {
            const err: any = new Error('Order not found');
            err.status = 404;
            throw err;
        }
        order.status = dto.status;
        return order;
    };

    findAll = async () => this.orders;
}

@Controller('orders')
class TestOrderController {
    constructor(private readonly order: FakeOrderApplication) {}

    @Post()
    createOrder(@Body() dto: any) {
        return this.order.createOrder(dto);
    }

    @Patch('status')
    updateOrderStatus(@Body() dto: any) {
        return this.order.updateOrderStatus(dto);
    }

    @Get()
    findAll() {
        return this.order.findAll();
    }
}

@Module({ controllers: [TestOrderController], providers: [FakeOrderApplication] })
class TestModule {}

describe('Merch Orders API (e2e)', () => {
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

    it('POST /orders creates an order and returns 201', async () => {
        const res = await request(app.getHttpServer())
            .post('/orders')
            .send({ items: [{ sku: 'SKU-1', qty: 2 }], customer: 'cust-1' })
            .expect(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.status).toBe('CREATED');
    });

    it('PATCH /orders/status updates an existing order', async () => {
        const created = await request(app.getHttpServer())
            .post('/orders')
            .send({ items: [], customer: 'cust-1' })
            .expect(201);

        const res = await request(app.getHttpServer())
            .patch('/orders/status')
            .send({ id: created.body.id, status: 'PAID' })
            .expect(200);
        expect(res.body.status).toBe('PAID');
    });

    it('GET /orders returns the list of orders', async () => {
        await request(app.getHttpServer()).post('/orders').send({ items: [] }).expect(201);
        await request(app.getHttpServer()).post('/orders').send({ items: [] }).expect(201);

        const res = await request(app.getHttpServer()).get('/orders').expect(200);
        expect(res.body).toHaveLength(2);
    });
});
