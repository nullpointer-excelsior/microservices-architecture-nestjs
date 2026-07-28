import { Controller, Get, Post, Put, Delete, Param, Body, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as request from 'supertest';

@Injectable()
class FakeUserService {
    private users: any[] = [];
    private nextId = 1;

    findAll = async () => this.users;

    findById = async (id: string) => {
        if (id === 'missing') return undefined;
        return this.users.find((u) => u.id === id);
    };

    create = async (u: any) => {
        const user = { id: String(this.nextId++), ...u };
        this.users.push(user);
        return user;
    };

    update = async (u: any) => {
        const idx = this.users.findIndex((x) => x.id === u.id);
        if (idx === -1) {
            const err: any = new Error('User not found');
            err.status = 404;
            throw err;
        }
        this.users[idx] = { ...this.users[idx], ...u };
        return this.users[idx];
    };

    delete = async (id: string) => {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1) {
            const err: any = new Error('User not found');
            err.status = 404;
            throw err;
        }
        this.users.splice(idx, 1);
    };
}

@ApiTags('Users')
@Controller('users')
class TestUserController {
    constructor(private userService: FakeUserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Post()
    create(@Body() user: any) {
        return this.userService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: any) {
        return this.userService.update({ ...user, id });
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}

@Module({ controllers: [TestUserController], providers: [FakeUserService] })
class TestModule {}

describe('Accounts Users API (e2e)', () => {
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

    it('GET /users returns an empty list initially', async () => {
        const res = await request(app.getHttpServer()).get('/users').expect(200);
        expect(res.body).toEqual([]);
    });

    it('POST /users creates a user and returns 201', async () => {
        const res = await request(app.getHttpServer())
            .post('/users')
            .send({ username: 'tester', email: 'tester@example.com' })
            .expect(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBe('tester');
    });

    it('GET /users/:id returns the user', async () => {
        const created = await request(app.getHttpServer())
            .post('/users')
            .send({ username: 'tester' })
            .expect(201);
        const res = await request(app.getHttpServer())
            .get(`/users/${created.body.id}`)
            .expect(200);
        expect(res.body.username).toBe('tester');
    });

    it('PUT /users/:id updates the user', async () => {
        const created = await request(app.getHttpServer())
            .post('/users')
            .send({ username: 'before' })
            .expect(201);
        const res = await request(app.getHttpServer())
            .put(`/users/${created.body.id}`)
            .send({ username: 'after' })
            .expect(200);
        expect(res.body.username).toBe('after');
    });

    it('DELETE /users/:id removes the user', async () => {
        const created = await request(app.getHttpServer())
            .post('/users')
            .send({ username: 'to-delete' })
            .expect(201);
        await request(app.getHttpServer())
            .delete(`/users/${created.body.id}`)
            .expect(200);
        const res = await request(app.getHttpServer()).get('/users').expect(200);
        expect(res.body).toEqual([]);
    });
});
