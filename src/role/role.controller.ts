import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { RoleEntity, RoleWithPermissionsEntity, DeleteRoleResponseDto } from './entities/role.entity';

@ApiTags('Role Management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@Controller('role')
export class RoleController {
    constructor(private readonly role: RoleService) { }

    @Post()
    @Permissions('manage:roles')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new role' })
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({ status: 201, description: 'Role created successfully.', type: RoleEntity })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    async create(@Body() dto: CreateRoleDto, @Req() req) {
        const user = req.user as { userId: string }
        return this.role.create(dto, user.userId)
    }

    @Get()
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'Return all roles.', type: [RoleWithPermissionsEntity] })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    async findAll() {
        return this.role.findAll()
    }

    @Get(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get a single role by ID' })
    @ApiResponse({ status: 200, description: 'Return the role.', type: RoleWithPermissionsEntity })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    async findOne(@Param('id') id: string) {
        return this.role.findOne(id)
    }

    @Patch(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Update a role' })
    @ApiBody({ type: UpdateRoleDto })
    @ApiResponse({ status: 200, description: 'Role updated successfully.', type: RoleEntity })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
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
    @ApiResponse({ status: 200, description: 'Role deleted successfully.', type: DeleteRoleResponseDto })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    async remove(@Param('id') id: string, @Req() req) {
        const user = req.user as { userId: string };
        return this.role.remove(id, user.userId);
    }
}
