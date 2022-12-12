import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../Database/databaseModule';
import { CreateCustomerHandler, UpdateCustomerHandler, DeleteCustomerHandler } from './commands';
import { GetCustomerHandler, GetCustomersHandler } from './queries';
import { CustomerController } from './customerController';

const handlers = [
  CreateCustomerHandler,
  GetCustomerHandler,
  GetCustomersHandler,
  UpdateCustomerHandler,
  DeleteCustomerHandler,
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [CustomerController],
  providers: [...handlers],
})
export class CustomerModule {}
