import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Customer } from '../../Database/entities';
import { Not, Repository } from 'typeorm';
import { CustomerNotFoundException, DuplicateCustomerFoundException } from '../exceptions';

export class UpdateCustomerCommand {
  constructor(public readonly id: number, public readonly name: string, public readonly email: string) {}
}

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(@Inject(Customer.name) private customerRepository: Repository<Customer>) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ id: command.id });

    if (!customer) {
      throw new CustomerNotFoundException(command.id);
    }

    const duplicateEmailCustomer = await this.customerRepository.findOneBy({
      id: Not(command.id),
      email: command.email,
    });

    if (duplicateEmailCustomer) {
      throw new DuplicateCustomerFoundException(command.email);
    }

    await this.customerRepository.update({ id: command.id }, { name: command.name, email: command.email });
  }
}
