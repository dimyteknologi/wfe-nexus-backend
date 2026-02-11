import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private auditService: AuditService
    ) { }

    async login(email: string, password: string, ipValue?: string, userAgentValue?: string) {
        const ip = ipValue || 'unknown';
        const userAgent = userAgentValue || 'unknown';

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

        // 1. Check if user exists
        if (!user) {
            // Log failed attempt for non-existent user (optional, be careful with enumeration)
            this.auditService.log({
                action: 'LOGIN_FAILED',
                resource: 'Auth',
                details: `Failed login for email: ${email} (User not found)`,
                ipAddress: ip,
                userAgent: userAgent,
            });
            throw new UnauthorizedException('Invalid Credentials');
        }

        // 2. Check Account Lockout
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - new Date().getTime()) / 60000);
            this.auditService.log({
                action: 'LOGIN_LOCKED',
                resource: 'Auth',
                details: `Login attempt on locked account: ${email}`,
                userId: user.id,
                ipAddress: ip,
                userAgent: userAgent,
            });
            throw new UnauthorizedException(`Account is locked. Try again in ${minutesLeft} minutes.`);
        }

        // 3. Verify Password
        if (!(await bcrypt.compare(password, user.password))) {
            // Increment failed attempts
            const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
            let lockoutUntil: Date | undefined;

            // Lock out after 5 failures
            if (newFailedAttempts >= 5) {
                lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lock
            }

            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: newFailedAttempts,
                    lockoutUntil: lockoutUntil
                }
            });

            this.auditService.log({
                action: 'LOGIN_FAILED',
                resource: 'Auth',
                details: `Failed login attempt ${newFailedAttempts}/5`,
                userId: user.id,
                ipAddress: ip,
                userAgent: userAgent,
            });

            if (newFailedAttempts >= 5) {
                throw new UnauthorizedException('Account locked due to too many failed attempts. Try again in 15 minutes.');
            }

            throw new UnauthorizedException('Invalid Credentials');
        }

        // 4. Successful Login - Reset counters
        if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockoutUntil: null
                }
            });
        }

        // 5. Generate Token
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

        // 6. Log Success
        this.auditService.log({
            action: 'LOGIN_SUCCESS',
            resource: 'Auth',
            details: 'User logged in successfully',
            userId: user.id,
            ipAddress: ip,
            userAgent: userAgent,
        });

        return { access_token }
    }
}
