import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from './dtos';
import { GetCustomerQuery, GetCustomersQuery } from './queries';
import { CreateCustomerCommand, UpdateCustomerCommand, DeleteCustomerCommand } from './commands';
import { Customer } from '../Database/entities';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'List of customers', type: Customer, isArray: true })
  async getAll(): Promise<Customer[]> {
    const getCustomersQuery = new GetCustomersQuery();
    return await this.queryBus.execute(getCustomersQuery);
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer with specified id', type: Customer })
  async get(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    const getCustomerQuery = new GetCustomerQuery(id);
    return await this.queryBus.execute(getCustomerQuery);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() body: CreateCustomerDto): Promise<void> {
    const createCustomerCommand = new CreateCustomerCommand(body.name, body.email);
    return await this.commandBus.execute(createCustomerCommand);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCustomerDto): Promise<void> {
    const updateCustomerCommand = new UpdateCustomerCommand(id, body.name, body.email);
    return await this.commandBus.execute(updateCustomerCommand);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleteCustomerCommand = new DeleteCustomerCommand(id);
    return await this.commandBus.execute(deleteCustomerCommand);
  }
}
