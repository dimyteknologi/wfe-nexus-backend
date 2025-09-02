import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionToRoleDto, RemovePermissionFromRoleDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPermissionDto: CreatePermissionDto) {
        try {
            const existingPermission = await this.prisma.permission.findFirst({
                where: {
                    OR: [
                        { permissionCode: createPermissionDto.permissionCode },
                        { permissionName: createPermissionDto.permissionName }
                    ]
                }
            });

            if (existingPermission) {
                throw new ConflictException('Permission code or name already exists');
            }

            const permission = await this.prisma.permission.create({
                data: createPermissionDto
            });

            return permission;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to create permission');
        }
    }

    async findAll() {
        return this.prisma.permission.findMany({
            orderBy: { permissionName: 'asc' },
            include: {
                roles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
    }

    async findOne(id: string) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

        return permission;
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto) {
        try {
            // Check if permission exists
            await this.findOne(id);

            // Check for conflicts with other permissions
            if (updatePermissionDto.permissionCode || updatePermissionDto.permissionName) {
                const existingPermission = await this.prisma.permission.findFirst({
                    where: {
                        AND: [
                            { id: { not: id } },
                            {
                                OR: [
                                    updatePermissionDto.permissionCode ? { permissionCode: updatePermissionDto.permissionCode } : {},
                                    updatePermissionDto.permissionName ? { permissionName: updatePermissionDto.permissionName } : {}
                                ]
                            }
                        ]
                    }
                });

                if (existingPermission) {
                    throw new ConflictException('Permission code or name already exists');
                }
            }

            const permission = await this.prisma.permission.update({
                where: { id },
                data: updatePermissionDto,
                include: {
                    roles: {
                        include: {
                            role: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            return permission;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Failed to update permission');
        }
    }

    async remove(id: string) {
        try {
            // Check if permission exists
            await this.findOne(id);

            // Check if permission is in use by any roles
            const permissionInUse = await this.prisma.rolePermission.findFirst({
                where: { permissionId: id }
            });

            if (permissionInUse) {
                throw new BadRequestException('Cannot delete permission that is assigned to roles');
            }

            await this.prisma.permission.delete({
                where: { id }
            });

            return { message: 'Permission deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to delete permission');
        }
    }

    async assignPermissionsToRole(assignDto: AssignPermissionToRoleDto, currentUserId: string) {
        try {
            // Verify role exists
            const role = await this.prisma.role.findUnique({
                where: { id: assignDto.roleId }
            });

            if (!role) {
                throw new NotFoundException('Role not found');
            }

            // Verify all permissions exist
            const permissions = await this.prisma.permission.findMany({
                where: { id: { in: assignDto.permissionIds } }
            });

            if (permissions.length !== assignDto.permissionIds.length) {
                throw new NotFoundException('One or more permissions not found');
            }

            // Remove existing permissions for this role
            await this.prisma.rolePermission.deleteMany({
                where: { roleId: assignDto.roleId }
            });

            // Add new permissions
            const rolePermissions = assignDto.permissionIds.map(permissionId => ({
                roleId: assignDto.roleId,
                permissionId,
                updatedBy: currentUserId
            }));

            await this.prisma.rolePermission.createMany({
                data: rolePermissions
            });

            // Return updated role with permissions
            return await this.prisma.role.findUnique({
                where: { id: assignDto.roleId },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to assign permissions to role');
        }
    }

    async removePermissionsFromRole(removeDto: RemovePermissionFromRoleDto) {
        try {
            // Verify role exists
            const role = await this.prisma.role.findUnique({
                where: { id: removeDto.roleId }
            });

            if (!role) {
                throw new NotFoundException('Role not found');
            }

            // Remove specified permissions from role
            await this.prisma.rolePermission.deleteMany({
                where: {
                    roleId: removeDto.roleId,
                    permissionId: { in: removeDto.permissionIds }
                }
            });

            // Return updated role with permissions
            return await this.prisma.role.findUnique({
                where: { id: removeDto.roleId },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to remove permissions from role');
        }
    }

    async getPermissionsByRole(roleId: string) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return {
            role: {
                id: role.id,
                name: role.name
            },
            permissions: role.permissions.map(rp => rp.permission)
        };
    }

    async getUserPermissions(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
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
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            role: {
                id: user.role.id,
                name: user.role.name
            },
            permissions: user.role.permissions.map(rp => rp.permission)
        };
    }
}
