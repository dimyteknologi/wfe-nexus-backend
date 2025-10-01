import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ScenarioController],
  providers: [ScenarioService, PrismaService],
  exports: [ScenarioService],
})
export class ScenarioModule {}