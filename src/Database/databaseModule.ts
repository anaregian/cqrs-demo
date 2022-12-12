import { Module } from '@nestjs/common';
import { DatabaseService } from './databaseService';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
