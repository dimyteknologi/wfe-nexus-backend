import { Module } from '@nestjs/common';
import { KotaController } from './kota.controller';
import { KotaService } from './kota.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [KotaController],
  providers: [KotaService, PrismaService]
})
export class KotaModule {}
