import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from '../../Database/entities';
import { Repository } from 'typeorm';

export class GetCustomersQuery {
  constructor() {}
}

@QueryHandler(GetCustomersQuery)
export class GetCustomersHandler implements IQueryHandler<GetCustomersQuery> {
  constructor(@Inject(Customer.name) private customerRepository: Repository<Customer>) {}

  async execute(_: GetCustomersQuery): Promise<Customer[]> {
    const customers = await this.customerRepository.find();

    return customers;
  }
}
