import { PartialType } from '@nestjs/swagger';
import { CreateInstitusiDto } from './create-institusi.dto';

export class UpdateInstitusiDto extends PartialType(CreateInstitusiDto) {}
