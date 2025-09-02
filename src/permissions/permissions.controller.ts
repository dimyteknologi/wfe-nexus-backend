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
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiParam
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionToRoleDto, RemovePermissionFromRoleDto } from './dto/assign-permission.dto';

@ApiTags('Permissions Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, AdminGuard)
@AdminOnly()
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create new permission (Admin only)' })
    @ApiResponse({ status: 201, description: 'Permission created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 409, description: 'Conflict - Permission already exists' })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all permissions (Admin only)' })
    @ApiResponse({ status: 200, description: 'All permissions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get permission by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Permission ID' })
    @ApiResponse({ status: 200, description: 'Permission retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Permission not found' })
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update permission (Admin only)' })
    @ApiParam({ name: 'id', description: 'Permission ID' })
    @ApiResponse({ status: 200, description: 'Permission updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Permission not found' })
    @ApiResponse({ status: 409, description: 'Conflict - Permission already exists' })
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete permission (Admin only)' })
    @ApiParam({ name: 'id', description: 'Permission ID' })
    @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Permission in use' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Permission not found' })
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(id);
    }

    @Post('assign-to-role')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Assign permissions to role (Admin only)' })
    @ApiResponse({ status: 200, description: 'Permissions assigned to role successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role or permissions not found' })
    assignToRole(@Body() assignDto: AssignPermissionToRoleDto, @Req() req) {
        const currentUserId = req.user.userId;
        return this.permissionsService.assignPermissionsToRole(assignDto, currentUserId);
    }

    @Post('remove-from-role')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remove permissions from role (Admin only)' })
    @ApiResponse({ status: 200, description: 'Permissions removed from role successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    removeFromRole(@Body() removeDto: RemovePermissionFromRoleDto) {
        return this.permissionsService.removePermissionsFromRole(removeDto);
    }

    @Get('by-role/:roleId')
    @ApiOperation({ summary: 'Get permissions by role ID (Admin only)' })
    @ApiParam({ name: 'roleId', description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    getPermissionsByRole(@Param('roleId') roleId: string) {
        return this.permissionsService.getPermissionsByRole(roleId);
    }

    @Get('by-user/:userId')
    @ApiOperation({ summary: 'Get user permissions (Admin only)' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'User not found' })
    getUserPermissions(@Param('userId') userId: string) {
        return this.permissionsService.getUserPermissions(userId);
    }
}
