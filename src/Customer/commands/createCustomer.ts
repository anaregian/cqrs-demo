import { DuplicateCustomerFoundException } from '../exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Customer } from '../../Database/entities';
import { Repository } from 'typeorm';

export class CreateCustomerCommand {
  constructor(public readonly name: string, public readonly email: string) {}
}

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(@Inject(Customer.name) private customerRepository: Repository<Customer>) {}

  async execute(command: CreateCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ email: command.email });

    if (customer) {
      throw new DuplicateCustomerFoundException(command.email);
    }

    await this.customerRepository.insert(command);
  }
}
