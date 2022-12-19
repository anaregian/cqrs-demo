import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateCustomerSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty().email(),
});

export class UpdateCustomerDto extends createZodDto(UpdateCustomerSchema) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
