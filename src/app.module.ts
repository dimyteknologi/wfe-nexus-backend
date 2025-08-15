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

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule, UserModule, RoleModule, PermissionsModule, KotaModule, TahunModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
