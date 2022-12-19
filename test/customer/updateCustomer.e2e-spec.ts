import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository, DataSource } from 'typeorm';
import { Customer } from '../../src/Database/entities';
import { UpdateCustomerDto } from '../../src/Customer/dtos';
import { DATABASE_CONNECTION } from '../../src/Database/databaseModule';
import { AppModule } from '../../src/appModule';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

const data: Partial<Customer>[] = [
  {
    name: 'test1',
    email: 'test1@test.com',
  },
  {
    name: 'test2',
    email: 'test2@test.com',
  },
];

describe('When calling the PUT customer endpoint', () => {
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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

  it('Given a valid id and payload, then it should update the customer in the database', async () => {
    const dto: UpdateCustomerDto = {
      name: 'test',
      email: 'test@test.com',
    };
    const id = 1;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    const customer = await customerRepository.findOneBy({ id });

    expect(response.status).toBe(200);
    expect(customer.name).toBe(dto.name);
    expect(customer.email).toBe(dto.email);
  });

  it('Given an empty name, then it should return 400', async () => {
    const dto: UpdateCustomerDto = {
      name: '',
      email: 'test@test.com',
    };

    const id = 1;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    expect(response.status).toBe(400);
  });

  it('Given an empty email, then it should return 400', async () => {
    const dto: UpdateCustomerDto = {
      name: 'test',
      email: '',
    };

    const id = 1;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    expect(response.status).toBe(400);
  });

  it('Given an invalid email, then it should return 400', async () => {
    const dto: UpdateCustomerDto = {
      name: 'test',
      email: 'test',
    };

    const id = 1;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    expect(response.status).toBe(400);
  });

  it('Given a non-unique email, then it should return 400', async () => {
    const dto: UpdateCustomerDto = {
      name: 'test',
      email: 'test2@test.com',
    };

    const id = 1;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    expect(response.status).toBe(400);
  });

  it('Given an invalid id, then it should return 404', async () => {
    const dto: UpdateCustomerDto = {
      name: 'test',
      email: 'test2@test.com',
    };

    const id = 5;

    const response = await request(app.getHttpServer()).put(`/api/v1/customers/${id}`).send(dto);

    expect(response.status).toBe(404);
  });
});
