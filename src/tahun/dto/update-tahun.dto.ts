import { PartialType } from '@nestjs/swagger';
import { CreateTahunDto } from './create-tahun.dto';

export class UpdateTahunDto extends PartialType(CreateTahunDto) {}