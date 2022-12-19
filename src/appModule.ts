import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { CustomerModule } from './Customer/customerModule';

const modules = [CustomerModule];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...modules],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
