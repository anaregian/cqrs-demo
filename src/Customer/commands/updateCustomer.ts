import { DatabaseService } from '../../Database/databaseService';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerNotFoundException, DuplicateCustomerFoundException } from '../exceptions';

export class UpdateCustomerCommand {
  constructor(public readonly id: number, public readonly name: string, public readonly email: string) {}
}

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(private db: DatabaseService) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customer = await this.db.customer.findFirst({ where: { id: command.id } });

    if (customer) {
      throw new CustomerNotFoundException(command.id);
    }

    const duplicateEmailCustomer = await this.db.customer.findFirst({
      where: { id: { not: command.id }, email: customer.email },
    });

    if (duplicateEmailCustomer) {
      throw new DuplicateCustomerFoundException(command.email);
    }

    await this.db.customer.update({ where: { id: command.id }, data: { name: command.name, email: command.email } });
  }
}
