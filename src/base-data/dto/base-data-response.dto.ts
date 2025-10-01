import { ApiProperty } from "@nestjs/swagger";

class ParameterDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ type: [Number]})
    values: number[];
}

class DataDto {
    @ApiProperty()
    label: string;

    @ApiProperty()
    unit: string;

    @ApiProperty({type: [Number]})
    years: number[];

    @ApiProperty({ type: [ParameterDto]})
    parameters: ParameterDto[];
}

export class BaseDataResponseDto {
    @ApiProperty({ type: DataDto })
    data: DataDto
}