import { DuplicateCustomerFoundException } from './../exceptions/duplicateCustomerFoundException';
import { CustomerNotFoundException } from './../exceptions/customerNotFoundException';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOperator, FindOptionsWhere, Not, Repository } from 'typeorm';
import { Customer } from '../../Database/entities';
import { UpdateCustomerHandler, UpdateCustomerCommand } from '.';

const data: Customer[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.com',
    orders: Promise.resolve([]),
  },
  {
    id: 2,
    name: 'test1',
    email: 'test1@test.com',
    orders: Promise.resolve([]),
  },
];

describe('When calling UpdateCustomerHandler', () => {
  let handler: UpdateCustomerHandler;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const customerRepositoryMock = {
      findOneBy: jest.fn((x: FindOptionsWhere<Customer>) => {
        if (x.email) {
          return data.filter((d) => d.email === x.email).find((d) => d.id !== (x.id as FindOperator<number>).value);
        }
        return data.find((d) => d.id === x.id);
      }),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerHandler,
        {
          provide: Customer.name,
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get(UpdateCustomerHandler);
    customerRepository = module.get(Customer.name);
  });

  it('Given a non-existing id, then it should throw a CustomerNotFoundException', async () => {
    const data = { id: 3, name: 'new', email: 'new@new.com' };
    const command = new UpdateCustomerCommand(data.id, data.name, data.email);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(CustomerNotFoundException);
      expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
      return;
    }
    fail('it should not reach here');
  });

  it('Given an already existing email, then it should throw a DuplicateCustomerFoundException', async () => {
    const data = { id: 2, name: 'test', email: 'test@test.com' };
    const command = new UpdateCustomerCommand(data.id, data.name, data.email);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(DuplicateCustomerFoundException);
      expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
      expect(customerRepository.findOneBy).toBeCalledWith({ id: Not(command.id), email: command.email });
      return;
    }
    fail('it should not reach here');
  });

  it('Given a valid id and identical payload, then it should update the customer', async () => {
    const data = { id: 1, name: 'test', email: 'test@test.com' };
    const command = new UpdateCustomerCommand(data.id, data.name, data.email);

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
    expect(customerRepository.findOneBy).toBeCalledWith({ id: Not(command.id), email: command.email });
    expect(customerRepository.update).toBeCalledWith({ id: command.id }, { name: command.name, email: command.email });
  });

  it('Given a valid id and new payload, then it should update the customer', async () => {
    const data = { id: 1, name: 'new', email: 'new@new.com' };
    const command = new UpdateCustomerCommand(data.id, data.name, data.email);

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
    expect(customerRepository.findOneBy).toBeCalledWith({ id: Not(command.id), email: command.email });
    expect(customerRepository.update).toBeCalledWith({ id: command.id }, { name: command.name, email: command.email });
  });
});
