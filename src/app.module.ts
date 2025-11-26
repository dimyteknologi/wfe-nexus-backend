import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { KotaModule } from './kota/kota.module';
import { TahunModule } from './tahun/tahun.module';
import { ImportModule } from './import/import.module';
import { InstitusiModule } from './institusi/institusi.module';
import { ScenarioModule } from './scenario/scenario.module';
import { BaseDataModule } from './base-data/base-data.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule, UserModule, RoleModule, PermissionsModule, KotaModule, TahunModule, ImportModule, InstitusiModule, ScenarioModule, BaseDataModule, SimulationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
