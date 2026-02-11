import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(data: {
        action: string;
        resource: string;
        details?: string;
        userId?: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: data.action,
                    resource: data.resource,
                    details: data.details,
                    userId: data.userId,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log', error);
            // Audit failure should not block the main action, but should be noted
        }
    }
}
