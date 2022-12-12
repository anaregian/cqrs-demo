import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './Customer/customerModule';

const modules = [CustomerModule];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...modules],
})
export class AppModule {}
