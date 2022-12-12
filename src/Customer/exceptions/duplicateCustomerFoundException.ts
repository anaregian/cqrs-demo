import { BadRequestException } from '@nestjs/common';

export class DuplicateCustomerFoundException extends BadRequestException {
  constructor(email: string) {
    super(`Customer with email ${email} already exists`);
  }
}
