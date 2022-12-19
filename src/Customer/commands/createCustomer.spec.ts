import { DuplicateCustomerFoundException } from '../exceptions/duplicateCustomerFoundException';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Customer } from '../../Database/entities';
import { CreateCustomerHandler, CreateCustomerCommand } from '.';

const data: Customer[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.com',
    orders: Promise.resolve([]),
  },
];

describe('When calling CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const customerRepositoryMock = {
      findOneBy: jest.fn((x: FindOptionsWhere<Customer>) => data.find((d) => d.email === x.email)),
      insert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerHandler,
        {
          provide: Customer.name,
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get(CreateCustomerHandler);
    customerRepository = module.get(Customer.name);
  });

  it('Given an existing email, then it should throw a DuplicateCustomerFoundException', async () => {
    const data = { name: 'test', email: 'test@test.com' };
    const command = new CreateCustomerCommand(data.name, data.email);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(DuplicateCustomerFoundException);
      expect(customerRepository.findOneBy).toBeCalledWith({ email: command.email });
      return;
    }
    fail('it should not reach here');
  });

  it('Given a unique email, then it should create a customer', async () => {
    const data = { name: 'test1', email: 'test1@test.com' };
    const command = new CreateCustomerCommand(data.name, data.email);

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.findOneBy).toBeCalledWith({ email: command.email });
    expect(customerRepository.insert).toBeCalledWith(command);
  });
});
