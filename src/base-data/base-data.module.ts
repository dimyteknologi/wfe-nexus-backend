import { Module } from '@nestjs/common';
import { BaseDataController } from './base-data.controller';
import { BaseDataService } from './base-data.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [BaseDataController],
  providers: [BaseDataService, PrismaService]
})
export class BaseDataModule {}
