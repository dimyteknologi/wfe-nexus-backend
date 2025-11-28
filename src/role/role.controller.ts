import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@Controller('role')
export class RoleController {
    constructor(private readonly role: RoleService) { }

    @Post()
    @Permissions('manage:roles')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({ status: 201, description: 'Role created successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() dto: CreateRoleDto, @Req() req) {
        const user = req.user as { userId: string }
        return this.role.create(dto, user.userId)
    }

    @Get()
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get all roles' })
    async findAll() {
        return this.role.findAll()
    }

    @Get(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get a single role by ID' })
    async findOne(@Param('id') id: string) {
        return this.role.findOne(id)
    }

    @Patch(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Update a role' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateRoleDto,
        @Req() req,
    ) {
        const currentUserId = req.user.userId;
        return this.role.update(id, dto, currentUserId);
    }

    @Delete(':id')
    @Permissions('manage:roles')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a role (soft delete)' })
    async remove(@Param('id') id: string, @Req() req) {
        const user = req.user as { userId: string };
        return this.role.remove(id, user.userId);
    }
}
