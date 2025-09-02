import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from 'src/role/dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name)
    constructor(private prisma: PrismaService) {}

    async create (dto: CreateUserDto, currentUserId: string) {
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.name,
                    roleId: dto.roleId,
                    cityId: dto.cityId,
                    institutionId: dto.institutionId,
                    updatedBy: currentUserId
                },
                include: {
                    role: true,
                }
            })
            return user
        } catch (error) {
            this.logger.error(`Create user failed: ${error.message}`)
            throw new InternalServerErrorException('Failed to create user')
        }
    }

    async findAll() {
        return this.prisma.user.findMany({
            where: { deletedAt: null },
            include: { role: true }
        })
    }

    async findOne(id: string){
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            include: { role: true }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async update(id: string, dto: UpdateUserDto, currentUserId: string){
        try {
            let hashedPassword: string | undefined = undefined;
            if (dto.password) {
                hashedPassword = await bcrypt.hash(dto.password, 10)
            }

            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    email: dto.email,
                    name: dto.name,
                    roleId: dto.roleId,
                    updatedBy: currentUserId,
                    ...(hashedPassword ? { password: hashedPassword }: {})
                },
                include: {
                    role: true,
                }
            })
            return user
        } catch (error) {
            this.logger.error(`Update user failed: ${error.message}`)
            throw new InternalServerErrorException('Failed to update user')
        }
    }

    async remove(id: string, currentUserId: string) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    updatedBy: currentUserId
                }
            })
            return user
        } catch (error) {

        }
    }
}
