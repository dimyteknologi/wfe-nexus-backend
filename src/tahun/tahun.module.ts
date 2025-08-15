import { Module } from '@nestjs/common';
import { TahunController } from './tahun.controller';
import { TahunService } from './tahun.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TahunController],
  providers: [TahunService, PrismaService]
})
export class TahunModule {}
