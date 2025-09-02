import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInstitusiDto } from './dto/create-institusi.dto';
import { UpdateInstitusiDto } from './dto/update-institusi.dto';

@Injectable()
export class InstitusiService {
  constructor(private prisma: PrismaService) {}

  async create(createInstitusiDto: CreateInstitusiDto, currentUserId: string) {
    try {
      const institusi = await this.prisma.institution.create({
        data: {
          ...createInstitusiDto,
          updatedBy: currentUserId,
        },
      });
      return institusi;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Institution name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.institution.findMany({
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
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const institusi = await this.prisma.institution.findFirst({
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
            cities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!institusi) {
      throw new NotFoundException('Institution not found');
    }

    return institusi;
  }

  async update(id: string, updateInstitusiDto: UpdateInstitusiDto, currentUserId: string) {
    const existingInstitusi = await this.prisma.institution.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingInstitusi) {
      throw new NotFoundException('Institution not found');
    }

    try {
      const institusi = await this.prisma.institution.update({
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
        throw new BadRequestException('Institution name already exists');
      }
      throw error;
    }
  }

  async remove(id: string, currentUserId: string) {
    const existingInstitusi = await this.prisma.institution.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingInstitusi) {
      throw new NotFoundException('Institution not found');
    }

    const userCount = await this.prisma.user.count({
      where: {
        institutionId: id,
        deletedAt: null,
      },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        `Cannot delete institution that still has ${userCount} active users`
      );
    }

    const institusi = await this.prisma.institution.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: currentUserId,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Institution deleted successfully',
      institusi,
    };
  }
}
