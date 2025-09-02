import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InstitusiService } from './institusi.service';
import { CreateInstitusiDto } from './dto/create-institusi.dto';
import { UpdateInstitusiDto } from './dto/update-institusi.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@ApiTags('institusi')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('institusi')
export class InstitusiController {
  constructor(private readonly institusiService: InstitusiService) {}

  @Post()
  @Permissions('manage:institusi')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstitusiDto: CreateInstitusiDto, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.create(createInstitusiDto, currentUserId);
  }

  @Get()
  @Permissions('read:institusi')
  findAll() {
    return this.institusiService.findAll();
  }

  @Get(':id')
  @Permissions('read:institusi')
  findOne(@Param('id') id: string) {
    return this.institusiService.findOne(id);
  }

  @Patch(':id')
  @Permissions('manage:institusi')
  update(@Param('id') id: string, @Body() updateInstitusiDto: UpdateInstitusiDto, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.update(id, updateInstitusiDto, currentUserId);
  }

  @Delete(':id')
  @Permissions('manage:institusi')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.remove(id, currentUserId);
  }
}
