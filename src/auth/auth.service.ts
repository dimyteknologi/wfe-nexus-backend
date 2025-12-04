import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { permission } from 'process';
import { access } from 'fs';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email, deletedAt: null },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        const permissions = user.role.permissions.map(
            (rp) => rp.permission.permissionCode,
        );

        const payload = {
            sub: user.id,
            userName: user.name,
            role: user.role.name,
            cityId: user.cityId,
            permissions
        }
        const access_token = this.jwt.sign(payload)


        return { access_token }
    }
}
