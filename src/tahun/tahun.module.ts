import { Module } from '@nestjs/common';
import { TahunController } from './tahun.controller';
import { TahunService } from './tahun.service';

@Module({
  controllers: [TahunController],
  providers: [TahunService]
})
export class TahunModule {}
