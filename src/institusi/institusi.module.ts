import { Module } from '@nestjs/common';
import { InstitusiService } from './institusi.service';
import { InstitusiController } from './institusi.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [InstitusiController],
  providers: [InstitusiService, PrismaService],
  exports: [InstitusiService]
})
export class InstitusiModule {}
