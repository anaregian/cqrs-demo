import { DATABASE_CONNECTION } from '../../src/Database/databaseModule';
import { INestApplication, VersioningType } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository, DataSource } from 'typeorm';
import { Customer } from '../../src/Database/entities';
import { data } from './stubs';
import { AppModule } from '../../src/appModule';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

describe('When calling the DELETE customer endpoint', () => {
  let app: INestApplication;
  let db: DataSource;
  let customerRepository: Repository<Customer>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: APP_PIPE,
          useClass: ZodValidationPipe,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    db = moduleFixture.get(DATABASE_CONNECTION);
    customerRepository = moduleFixture.get(Customer.name);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    if (db.isInitialized) {
      await db.destroy();
      await db.initialize();
    }
    await customerRepository.insert(data);
  });

  it('Given a valid id, then it should delete the chosen customer from the database', async () => {
    const id = 1;
    const expectedRemainingCustomers = data.filter((d) => d.id !== id);

    const response = await request(app.getHttpServer()).delete(`/api/v1/customers/${id}`);

    const remainingCustomers = await customerRepository.find();

    expect(response.status).toBe(200);
    expect(remainingCustomers.length).toBe(expectedRemainingCustomers.length);
    expect(remainingCustomers.map((c) => c.id)).not.toContain(id);
  });

  it('Given an invalid id, then it should return 400', async () => {
    const id = 'asd';

    const response = await request(app.getHttpServer()).delete(`/api/v1/customers/${id}`);

    expect(response.status).toBe(400);
  });

  it('Given a non-existing id, then it should return 404', async () => {
    const id = 3;

    const response = await request(app.getHttpServer()).delete(`/api/v1/customers/${id}`);

    expect(response.status).toBe(404);
  });
});
