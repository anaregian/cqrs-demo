import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from '@prisma/client';
import { DatabaseService } from '../../Database/databaseService';

export class GetCustomersQuery {
  constructor() {}
}

@QueryHandler(GetCustomersQuery)
export class GetCustomersHandler implements IQueryHandler<GetCustomersQuery> {
  constructor(private db: DatabaseService) {}

  async execute(): Promise<Customer[]> {
    const customers = await this.db.customer.findMany();

    return customers;
  }
}
