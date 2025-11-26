import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BaseDataResponseDto } from './dto/base-data-response.dto';

@Injectable()
export class BaseDataService {
    constructor(private prisma: PrismaService) {}

    private async getHistoriesDataTypeId(): Promise<string> {
        const historiesDataType = await this.prisma.dataType.findUnique({
            where: { name: 'histories' },
        });

        if (!historiesDataType) {
            throw new NotFoundException('Data type "histories" not found. Please run the seeder first.');
        }
        return historiesDataType.id;
    }

    async getPopulationData(cityId: string): Promise<BaseDataResponseDto> {
        const historiesDataTypeId = await this.getHistoriesDataTypeId();

        const populationData = await this.prisma.population.findMany({
            where: {
                cityId,
                dataTypeId: historiesDataTypeId,
                scenarioId: null,
            },
            include: { year: true },
            orderBy: { year: { year: 'asc' } },
        });

        if (populationData.length === 0) {
            throw new NotFoundException('Population data not found for this city.');
        }

        const years = populationData.map(d => d.year.year);
        const maleValues = populationData.map(d => d.male);
        const femaleValues = populationData.map(d => d.female);

        return {
            data: {
                label: 'populasi',
                unit: 'orang',
                years: years,
                parameters: [
                    { name: 'laki-laki', values: maleValues },
                    { name: 'perempuan', values: femaleValues },
                ],
            },
        };
    }

    async getPertanianData(cityId: string): Promise<BaseDataResponseDto> {
        const historiesDataTypeId = await this.getHistoriesDataTypeId();
    
        const agricultureData = await this.prisma.agriculture.findMany({
            where: {
                cityId: cityId,
                dataTypeId: historiesDataTypeId,
                scenarioId: null,
            },
            include: {
                year: true,
            },
            orderBy: {
                year: { year: 'asc' },
            },
        });
    
        if (agricultureData.length === 0) {
            throw new NotFoundException('Agriculture data not found for this city.');
        }
    
        const years = agricultureData.map(d => d.year.year);
        const riceValues = agricultureData.map(d => d.rice_cultivation_area);
    
        return {
            data: {
                label: 'pertanian_luas',
                unit: 'ha/tahun',
                years: years,
                parameters: [
                    {
                        name: 'Lahan Panen Padi',
                        values: riceValues,
                    },
                ],
            },
        };
    }

    async getPeternakanData(cityId: string): Promise<BaseDataResponseDto> {
        const historiesDataTypeId = await this.getHistoriesDataTypeId();
    
        const livestockData = await this.prisma.livestock.findMany({
            where: {
                cityId: cityId,
                dataTypeId: historiesDataTypeId,
                scenarioId: null,
            },
            include: { year: true },
            orderBy: [{ year: { year: 'asc' } }, { livestock_type: 'asc' }],
        });
    
        if (livestockData.length === 0) {
            throw new NotFoundException('Livestock data not found for this city.');
        }
    
        const years = [...new Set(livestockData.map(d => d.year.year))].sort();
        const livestockTypes = [...new Set(livestockData.map(d => d.livestock_type))];
    
        const parameters = livestockTypes.map(type => {
            const values = years.map(year => {
                const record = livestockData.find(d => d.year.year === year && d.livestock_type === type);
                return record?.change_rate ?? 0;
            });
            return { name: type, values };
        });
    
        return {
            data: {
                label: 'peternakan_laju_perubahan',
                unit: '1/tahun',
                years: years,
                parameters: parameters,
            },
        };
    }
    
    async getPerikananData(cityId: string): Promise<BaseDataResponseDto> {
        const historiesDataTypeId = await this.getHistoriesDataTypeId();
    
        const fisheriesData = await this.prisma.fisheries.findMany({
            where: {
                cityId: cityId,
                dataTypeId: historiesDataTypeId,
                scenarioId: null,
            },
            include: {
                year: true,
            },
            orderBy: {
                year: { year: 'asc' },
            },
        });
    
        if (fisheriesData.length === 0) {
            throw new NotFoundException('Fisheries data not found for this city.');
        }
    
        const years = fisheriesData.map(d => d.year.year);
        // FIX: Use the nullish coalescing operator (??) to default null/undefined to 0
        const growthRateValues = fisheriesData.map(d => d.growth_rate ?? 0);
    
        return {
            data: {
                label: 'area_perikanan_laju_perubahan',
                unit: '1/tahun',
                years: years,
                parameters: [
                    {
                        name: 'area perikanan',
                        values: growthRateValues,
                    },
                ],
            },
        };
    }

    async getGdpData(cityId: string): Promise<BaseDataResponseDto> {
        const historiesDataTypeId = await this.getHistoriesDataTypeId();
    
        const gdpData = await this.prisma.gDRP.findMany({
            where: {
                cityId: cityId,
                dataTypeId: historiesDataTypeId,
                scenarioId: null,
            },
            include: {
                year: true,
            },
            orderBy: [{ year: { year: 'asc' } }, { sector: 'asc' }],
        });
    
        if (gdpData.length === 0) {
            throw new NotFoundException('GDRP data not found for this city.');
        }
    
        const years = [...new Set(gdpData.map(d => d.year.year))].sort();
        const sectors = [...new Set(gdpData.map(d => d.sector))];
    
        const parameters = sectors.map(sector => {
            const values = years.map(year => {
                const record = gdpData.find(d => d.year.year === year && d.sector === sector);
                return record?.value ?? 0;
            });
            return { name: sector, values };
        });
    
        return {
            data: {
                label: 'PDRB',
                unit: 'jutaan rupiah',
                years: years,
                parameters: parameters,
            },
        };
    }
}