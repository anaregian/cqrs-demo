import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Customer, Part, Order } from './entities';
import { dataSource } from './ormconfig';
import { testDataSource } from './testormconfig';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const customerProvider = {
  provide: Customer.name,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Customer),
  inject: [DATABASE_CONNECTION],
};

export const partProvider = {
  provide: Part.name,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Part),
  inject: [DATABASE_CONNECTION],
};

export const orderProvider = {
  provide: Order.name,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
  inject: [DATABASE_CONNECTION],
};

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async () => {
    if (process.env.NODE_ENV === 'test') {
      return await testDataSource.initialize();
    }
    return await dataSource.initialize();
  },
};

@Module({
  providers: [databaseProvider, customerProvider, partProvider, orderProvider],
  exports: [databaseProvider, customerProvider, partProvider, orderProvider],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_CONNECTION) private connection: DataSource) {}
  onModuleDestroy() {
    this.connection.destroy();
  }
}
