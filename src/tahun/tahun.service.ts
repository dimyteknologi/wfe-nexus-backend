import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTahunDto } from './dto/create-tahun.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateTahunDto } from './dto/update-tahun.dto';

@Injectable()
export class TahunService {
    private readonly logger = new Logger(TahunService.name);
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateTahunDto) {
        try {
            return await this.prisma.years.create({
                data: dto
            })
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError && error.code == 'P2002'
            ) {
                throw new ConflictException('This year already exists');
            }
            this.logger.error(`Failed to create year: ${error.message}`)
            throw new InternalServerErrorException('Failed to create year')
        }
    }

    async findAll() {
        try {
            return await this.prisma.years.findMany({
                orderBy: { year: 'desc'}
            });
        } catch (error) {
            this.logger.error(`Failed to find all years: ${error.message}`);
            throw new InternalServerErrorException('Failed to find all years');
        }
    }

    async findOne(id: string) {
        const tahun = await this.prisma.years.findUnique({
            where: { id },
            include: {
                population: true,
                gdrp: true,
                agriculture: true,
            },
        });
        if (!tahun) {
            throw new NotFoundException(`Year with ID ${id} not found`);
        }
        return tahun;
    }

    async update(id: string, dto: UpdateTahunDto) {
        await this.findOne(id);
        try {
            return await this.prisma.years.update({
                where: { id },
                data: dto
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
            throw new ConflictException('This year already exists.');
            }
            this.logger.error(`Failed to update year with ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Failed to update year entry.');
        }
    }

    async remove(id: string) {
        await this.findOne(id);
        try {
            await this.prisma.years.delete({ where: { id } });
            return { message: `Year with ID ${id} deleted successfully.` };
        } catch (error) {
            this.logger.error(`Failed to delete year with ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete year entry.');
        }
    }

}
