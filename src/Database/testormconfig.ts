import { join } from 'path';
import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_TEST,
  entities: [join(__dirname, '/entities/*Entity{.ts,.js}')],
  synchronize: true,
  dropSchema: true,
  logging: false,
});
