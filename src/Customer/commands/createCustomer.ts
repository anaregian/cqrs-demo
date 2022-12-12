import { DuplicateCustomerFoundException } from '../exceptions';
import { DatabaseService } from '../../Database/databaseService';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateCustomerCommand {
  constructor(public readonly name: string, public readonly email: string) {}
}

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(private db: DatabaseService) {}

  async execute(command: CreateCustomerCommand): Promise<void> {
    const customer = await this.db.customer.findFirst({ where: { email: command.email } });

    if (customer) {
      throw new DuplicateCustomerFoundException(command.email);
    }

    await this.db.customer.create({ data: command });
  }
}
