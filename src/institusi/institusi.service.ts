import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInstitusiDto } from './dto/create-institusi.dto';
import { UpdateInstitusiDto } from './dto/update-institusi.dto';

@Injectable()
export class InstitusiService {
  constructor(private prisma: PrismaService) {}

  async create(createInstitusiDto: CreateInstitusiDto, currentUserId: string) {
    try {
      const institusi = await this.prisma.institusi.create({
        data: {
          ...createInstitusiDto,
          updatedBy: currentUserId,
        },
      });
      return institusi;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Nama institusi sudah digunakan');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.institusi.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        users: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        nama: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const institusi = await this.prisma.institusi.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        users: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            kota: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    if (!institusi) {
      throw new NotFoundException('Institusi tidak ditemukan');
    }

    return institusi;
  }

  async update(id: string, updateInstitusiDto: UpdateInstitusiDto, currentUserId: string) {
    const existingInstitusi = await this.prisma.institusi.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingInstitusi) {
      throw new NotFoundException('Institusi tidak ditemukan');
    }

    try {
      const institusi = await this.prisma.institusi.update({
        where: { id },
        data: {
          ...updateInstitusiDto,
          updatedBy: currentUserId,
          updatedAt: new Date(),
        },
      });
      return institusi;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Nama institusi sudah digunakan');
      }
      throw error;
    }
  }

  async remove(id: string, currentUserId: string) {
    const existingInstitusi = await this.prisma.institusi.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingInstitusi) {
      throw new NotFoundException('Institusi tidak ditemukan');
    }

    const userCount = await this.prisma.user.count({
      where: {
        institusiId: id,
        deletedAt: null,
      },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        `Tidak dapat menghapus institusi yang masih memiliki ${userCount} user aktif`
      );
    }

    const institusi = await this.prisma.institusi.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: currentUserId,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Institusi berhasil dihapus',
      institusi,
    };
  }
}
