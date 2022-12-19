import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateCustomerSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty().email(),
});

export class CreateCustomerDto extends createZodDto(CreateCustomerSchema) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
