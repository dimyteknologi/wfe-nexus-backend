import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: {
            importFromCsv: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('importCsv', () => {
    it('should import CSV file successfully', async () => {
      const mockFile = {
        originalname: 'test.csv',
        buffer: Buffer.from('tahun,kategori,parameter,nilai\n2024,populasi,laki_laki,100000'),
      } as Express.Multer.File;

      const mockResult = {
        status: 'success',
        imported: 1,
        failed: 0,
        errors: [],
        message: 'All data imported successfully',
      };

      jest.spyOn(service, 'importFromCsv').mockResolvedValue(mockResult);

      const result = await controller.importCsv(mockFile, 'kota-id', 'baseline', { user: { userId: 'user-id' } });

      expect(result).toEqual(mockResult);
      expect(service.importFromCsv).toHaveBeenCalledWith(mockFile, 'kota-id', 'baseline');
    });

    it('should throw error when file is missing', async () => {
      await expect(
        controller.importCsv(undefined as any, 'kota-id', 'baseline', { user: { userId: 'user-id' } })
      ).rejects.toThrow('File not found');
    });

    it('should throw error when kotaId is missing', async () => {
      const mockFile = {
        originalname: 'test.csv',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(
        controller.importCsv(mockFile, '', 'baseline', { user: { userId: 'user-id' } })
      ).rejects.toThrow('Parameter kotaId is required');
    });

    it('should throw error when file is not CSV', async () => {
      const mockFile = {
        originalname: 'test.xlsx',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(
        controller.importCsv(mockFile, 'kota-id', 'baseline', { user: { userId: 'user-id' } })
      ).rejects.toThrow('File must be in .csv format');
    });
  });
});
