import { DatabaseService } from '../../Database/databaseService';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerNotFoundException } from '../exceptions';

export class DeleteCustomerCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(private db: DatabaseService) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.db.customer.findFirst({ where: { id: command.id } });

    if (customer) {
      throw new CustomerNotFoundException(command.id);
    }

    await this.db.customer.delete({ where: { id: command.id } });
  }
}
