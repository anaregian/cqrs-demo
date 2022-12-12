import { NotFoundException } from '@nestjs/common';

export class CustomerNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Customer with id ${id} does not exist`);
  }
}
