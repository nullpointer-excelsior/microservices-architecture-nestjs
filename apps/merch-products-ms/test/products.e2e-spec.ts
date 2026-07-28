import { Controller, Get, Param, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakeProductApplication {
    private products = [
        { sku: 'SKU-1', name: 'T-Shirt', price: 25, stock: 100 },
        { sku: 'SKU-2', name: 'Mug', price: 15, stock: 50 },
    ];

    findAll = async () => this.products;

    findBySku = async (sku: string) => {
        if (sku === 'missing') return undefined;
        return this.products.find((p) => p.sku === sku);
    };
}

@Controller('products')
class TestProductController {
    constructor(private readonly product: FakeProductApplication) {}

    @Get(':sku')
    getBySku(@Param('sku') sku: string) {
        return this.product.findBySku(sku);
    }

    @Get()
    getAll() {
        return this.product.findAll();
    }
}

@Module({ controllers: [TestProductController], providers: [FakeProductApplication] })
class TestModule {}

describe('Merch Products API (e2e)', () => {
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

    it('GET /products returns the catalogue', async () => {
        const res = await request(app.getHttpServer())
            .get('/products')
            .expect(200);
        expect(res.body).toHaveLength(2);
        expect(res.body.map((p: any) => p.sku)).toEqual(['SKU-1', 'SKU-2']);
    });

    it('GET /products/:sku returns a single product', async () => {
        const res = await request(app.getHttpServer())
            .get('/products/SKU-1')
            .expect(200);
        expect(res.body.name).toBe('T-Shirt');
    });

    it('GET /products/:sku returns an empty body for unknown SKU', async () => {
        const res = await request(app.getHttpServer())
            .get('/products/missing')
            .expect(200);
        expect(res.body).toEqual({});
    });
});
