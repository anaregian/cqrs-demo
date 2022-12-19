import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Customer } from '../../Database/entities';
import { GetCustomersHandler, GetCustomersQuery } from '.';

const data: Customer[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.com',
    orders: Promise.resolve([]),
  },
];

describe('When calling GetCustomersHandler', () => {
  let handler: GetCustomersHandler;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const customerRepositoryMock = {
      find: jest.fn(() => data),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomersHandler,
        {
          provide: Customer.name,
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get(GetCustomersHandler);
    customerRepository = module.get(Customer.name);
  });

  it('Given an empty payload, then it should return all the customers', async () => {
    const command = new GetCustomersQuery();

    try {
      await handler.execute(command);
    } catch {
      fail('it should not reach here');
    }

    expect(customerRepository.find).toBeCalled();
  });
});
