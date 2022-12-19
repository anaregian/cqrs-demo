import { CustomerNotFoundException } from './../exceptions/customerNotFoundException';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Customer } from '../../Database/entities';
import { GetCustomerHandler, GetCustomerQuery } from '.';

const data: Customer[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.com',
    orders: Promise.resolve([]),
  },
];

describe('When calling GetCustomerHandler', () => {
  let handler: GetCustomerHandler;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const customerRepositoryMock = {
      findOneBy: jest.fn((x: FindOptionsWhere<Customer>) => data.find((d) => d.id === x.id)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomerHandler,
        {
          provide: Customer.name,
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get(GetCustomerHandler);
    customerRepository = module.get(Customer.name);
  });

  it('Given an invalid id, then it should throw a CustomerNotFoundException', async () => {
    const data = { id: 22222 };
    const command = new GetCustomerQuery(data.id);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(CustomerNotFoundException);
      expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
      return;
    }
    fail('it should not reach here');
  });

  it('Given a valid id, then it should return the customer', async () => {
    const data = { id: 1 };
    const command = new GetCustomerQuery(data.id);

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.findOneBy).toBeCalledWith({ id: command.id });
  });
});
