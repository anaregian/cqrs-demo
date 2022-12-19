import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerNotFoundException } from '../exceptions';
import { Inject } from '@nestjs/common';
import { Customer } from '../../Database/entities';
import { Repository } from 'typeorm';

export class DeleteCustomerCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(@Inject(Customer.name) private customerRepository: Repository<Customer>) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ id: command.id });

    if (!customer) {
      throw new CustomerNotFoundException(command.id);
    }

    await this.customerRepository.delete({ id: command.id });
  }
}
