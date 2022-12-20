import { INestApplication, VersioningType } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../../src/Database/entities';
import { DATABASE_CONNECTION } from '../../src/Database/databaseModule';
import { data } from './stubs';
import { AppModule } from '../../src/appModule';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

describe('When calling the GET customers endpoint', () => {
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

  it('Given an empty payload, then it should return 200', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/customers');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(data.length);
  });
});
