import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from '../../Database/entities';
import { Repository } from 'typeorm';
import { CustomerNotFoundException } from '../exceptions';

export class GetCustomerQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(@Inject(Customer.name) private customerRepository: Repository<Customer>) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id: query.id });

    if (!customer) {
      throw new CustomerNotFoundException(query.id);
    }

    return customer;
  }
}
