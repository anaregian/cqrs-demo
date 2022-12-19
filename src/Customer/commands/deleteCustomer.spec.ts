import { CustomerNotFoundException } from './../exceptions/customerNotFoundException';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Customer } from '../../Database/entities';
import { DeleteCustomerHandler, DeleteCustomerCommand } from '.';

const data: Customer[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.com',
    orders: Promise.resolve([]),
  },
];

describe('When calling DeleteCustomerHandler', () => {
  let handler: DeleteCustomerHandler;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const customerRepositoryMock = {
      findOneBy: jest.fn((x: FindOptionsWhere<Customer>) => data.find((d) => d.id === x.id)),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCustomerHandler,
        {
          provide: Customer.name,
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get(DeleteCustomerHandler);
    customerRepository = module.get(Customer.name);
  });

  it('Given a non-existing id, then it should throw a CustomerNotFoundException', async () => {
    const data = { id: 2 };
    const command = new DeleteCustomerCommand(data.id);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(CustomerNotFoundException);
      expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
      return;
    }
    fail('it should not reach here');
  });

  it('Given a valid id, then it should delete the customer', async () => {
    const data = { id: 1 };
    const command = new DeleteCustomerCommand(data.id);

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
    expect(customerRepository.delete).toBeCalledWith(command);
  });
});
