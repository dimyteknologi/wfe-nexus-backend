import { Module } from '@nestjs/common';
import { KotaController } from './kota.controller';
import { KotaService } from './kota.service';

@Module({
  controllers: [KotaController],
  providers: [KotaService]
})
export class KotaModule {}
