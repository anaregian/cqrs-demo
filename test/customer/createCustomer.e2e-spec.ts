import { INestApplication, VersioningType } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository, DataSource } from 'typeorm';
import { Customer } from '../../src/Database/entities';
import { CreateCustomerDto } from '../../src/Customer/dtos';
import { DATABASE_CONNECTION } from '../../src/Database/databaseModule';
import { data } from './stubs';
import { AppModule } from '../../src/appModule';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

describe('When calling the POST customer endpoint', () => {
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

  it('Given a valid payload, then it should create the customer in the database', async () => {
    const dto: CreateCustomerDto = {
      name: 'test2',
      email: 'test2@test.com',
    };
    const expectedId = 3;

    const response = await request(app.getHttpServer()).post('/api/v1/customers').send({
      name: 'test2',
      email: 'test2@test.com',
    });

    const customer = await customerRepository.findOneBy({ id: expectedId });

    expect(response.status).toBe(201);
    expect(customer.id).toBe(expectedId);
    expect(customer.name).toBe(dto.name);
    expect(customer.email).toBe(dto.email);
  });

  it('Given an empty name, then it should return 400', async () => {
    const dto: CreateCustomerDto = {
      name: '',
      email: 'test@test.com',
    };

    const response = await request(app.getHttpServer()).post('/api/v1/customers').send(dto);

    expect(response.status).toBe(400);
  });

  it('Given an empty email, then it should return 400', async () => {
    const dto: CreateCustomerDto = {
      name: 'test',
      email: '',
    };

    const response = await request(app.getHttpServer()).post('/api/v1/customers').send(dto);

    expect(response.status).toBe(400);
  });

  it('Given an invalid email, then it should return 400', async () => {
    const dto: CreateCustomerDto = {
      name: 'test',
      email: 'test',
    };

    const response = await request(app.getHttpServer()).post('/api/v1/customers').send(dto);

    expect(response.status).toBe(400);
  });

  it('Given a non-unique email, then it should return 400', async () => {
    const dto: CreateCustomerDto = {
      name: 'test',
      email: 'test1@test.com',
    };

    const response = await request(app.getHttpServer()).post('/api/v1/customers').send(dto);

    expect(response.status).toBe(400);
  });
});
