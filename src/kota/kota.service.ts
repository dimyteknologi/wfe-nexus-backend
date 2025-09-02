import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateKotaDto } from './dto/create-kota.dto';
import { UpdateKotaDto } from './dto/update-kota.dto';

@Injectable()
export class KotaService {
    private readonly logger = new Logger(KotaService.name);
    constructor(private readonly prisma: PrismaService) {}

    private normalizeName(name: string): string {
        if (!name) return name;
        const trimmed = name.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    async create(dto: CreateKotaDto) {
        const normalizeName = this.normalizeName(dto.name);
        try {
            return await this.prisma.cities.create({
                data: {
                name: normalizeName,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to create kota: ${error.message}`);
            throw new InternalServerErrorException('Failed to create kota');
        }
    }

    async findAll() {
        try {
            return await this.prisma.cities.findMany({
                orderBy: { name: 'asc'}
            });
        } catch (error) {
            this.logger.error(`Failed to fetch kota list: ${error.message}`);
            throw new InternalServerErrorException('Failed to fetch kota list')
        }
    }

    async findOne(id: string) {
        const kota = await this.prisma.cities.findUnique({
            where: { id },
        });
        if (!kota) {
            throw new NotFoundException(`Kota with ID ${id} not found`);
        }
        return kota;
    }

    async update(id: string, dto: UpdateKotaDto) {
        await this.findOne(id);

        const dataToUpdate: { name?: string } = {};
        if (dto.name) {
            dataToUpdate.name = this.normalizeName(dto.name)
        }
        try {
            return await this.prisma.cities.update({
                where: { id },
                data: dataToUpdate
            })
        } catch (error) {
            this.logger.error(`Failed to update kota with ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Failed to update kota');
        }
    }

    async remove(id: string) {
        await this.findOne(id);
        try {
            await this.prisma.cities.delete({
                where: { id },
            });
            return { message: `Kota widh Id ${id} has been successfully deleted.`}
        } catch (error) {
            this.logger.error(`Failed to delete kota with ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete kota');
        }
    }
}
