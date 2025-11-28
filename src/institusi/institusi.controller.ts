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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InstitusiService } from './institusi.service';
import { CreateInstitusiDto } from './dto/create-institusi.dto';
import { UpdateInstitusiDto } from './dto/update-institusi.dto';
import { InstitusiEntity, InstitusiWithUsersEntity } from './entities/institusi.entity';
import { DeleteInstitusiResponseDto, CountInstitusiResponseDto } from './dto/institusi-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@ApiTags('institusi')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('institusi')
export class InstitusiController {
  constructor(private readonly institusiService: InstitusiService) { }

  @Post()
  @Permissions('manage:institusi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new institution' })
  @ApiBody({ type: CreateInstitusiDto })
  @ApiResponse({ status: 201, description: 'Institution created successfully', type: InstitusiEntity })
  @ApiResponse({ status: 400, description: 'Institution name already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createInstitusiDto: CreateInstitusiDto, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.create(createInstitusiDto, currentUserId);
  }

  @Get()
  @Permissions('read:institusi')
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({ status: 200, description: 'Return all institutions', type: [InstitusiEntity] })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAll() {
    return this.institusiService.findAll();
  }

  @Get('total')
  @Permissions('read:institusi')
  @ApiOperation({ summary: 'Get total institutions count' })
  @ApiResponse({ status: 200, description: 'Return total count of institutions', type: CountInstitusiResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  count() {
    return this.institusiService.count();
  }

  @Get(':id')
  @Permissions('read:institusi')
  @ApiOperation({ summary: 'Get a single institution by ID' })
  @ApiResponse({ status: 200, description: 'Return the institution', type: InstitusiWithUsersEntity })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findOne(@Param('id') id: string) {
    return this.institusiService.findOne(id);
  }

  @Patch(':id')
  @Permissions('manage:institusi')
  @ApiOperation({ summary: 'Update an institution' })
  @ApiBody({ type: UpdateInstitusiDto })
  @ApiResponse({ status: 200, description: 'Institution updated successfully', type: InstitusiEntity })
  @ApiResponse({ status: 400, description: 'Institution name already exists' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  update(@Param('id') id: string, @Body() updateInstitusiDto: UpdateInstitusiDto, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.update(id, updateInstitusiDto, currentUserId);
  }

  @Delete(':id')
  @Permissions('manage:institusi')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an institution' })
  @ApiResponse({ status: 200, description: 'Institution deleted successfully', type: DeleteInstitusiResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot delete institution with active users' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  remove(@Param('id') id: string, @Req() req) {
    const currentUserId = req.user.userId;
    return this.institusiService.remove(id, currentUserId);
  }
}
