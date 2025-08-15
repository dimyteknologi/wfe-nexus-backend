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
            return await this.prisma.tahun.create({
                data: dto,
                include: { kota: true }
            })
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError && error.code == 'P2002'
            ) {
                throw new ConflictException('Tahun ini sudah ada untuk kota yang dipilih');
            }
            this.logger.error(`Gagal membuat tahun: ${error.message}`)
            throw new InternalServerErrorException('Gagal membuat tahun')
        }
    }

    async findAll() {
        try {
            return await this.prisma.tahun.findMany({
                orderBy: [{kota: { nama: 'asc'}}, { tahun: 'desc'}],
                include: { kota: true }
            });
        } catch (error) {
            this.logger.error(`Gagal menemukan semua tahun : ${error.message}`);
            throw new InternalServerErrorException('Gagal menemukan semua tahun');
        }
    }

    async findOne(id: string) {
        const tahun = await this.prisma.tahun.findUnique({
            where: { id },
            include: {
                kota: true,
                populasi: true,
                pdrb: true,
                pertanian: true,
            },
        });
        if (!tahun) {
            throw new NotFoundException(`Tahun dengan ID ${id} tidak ditemukan`);
        }
        return tahun;
    }

    async update(id: string, dto: UpdateTahunDto) {
        await this.findOne(id);
        try {
            return await this.prisma.tahun.update({
                where: { id },
                data: dto,
                include: { kota: true },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
            throw new ConflictException('Tahun ini sudah ada untuk kota yang dipilih.');
            }
            this.logger.error(`Gagal memperbarui tahun dengan ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Gagal memperbarui entri tahun.');
        }
    }

    async remove(id: string) {
        await this.findOne(id);
        try {
            await this.prisma.tahun.delete({ where: { id } });
            return { message: `Tahun dengan ID ${id} berhasil dihapus.` };
        } catch (error) {
            this.logger.error(`Gagal menghapus tahun dengan ID ${id}: ${error.message}`);
            throw new InternalServerErrorException('Gagal menghapus entri tahun.');
        }
    }

}
