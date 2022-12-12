import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from '@prisma/client';
import { DatabaseService } from '../../Database/databaseService';
import { CustomerNotFoundException } from '../exceptions';

export class GetCustomerQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(private db: DatabaseService) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.db.customer.findFirst({ where: { id: query.id } });

    if (!customer) {
      throw new CustomerNotFoundException(query.id);
    }

    return customer;
  }
}
