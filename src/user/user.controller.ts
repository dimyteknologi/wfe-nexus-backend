import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UserService } from './user.service';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserEntity, UserWithRelationsEntity, DeleteUserResponseDto, CountUserResponseDto } from './entities/user.entity';

@ApiTags('User Management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(private readonly user: UserService) { }

    @Post()
    @Permissions('manage:user')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully.', type: UserEntity })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    create(@Body() dto: CreateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.create(dto, currentUserId)
    }

    @Get()
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.', type: [UserWithRelationsEntity] })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    findAll() {
        return this.user.findAll()
    }

    @Get('total')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get total users count' })
    @ApiResponse({ status: 200, description: 'Return total count of users.', type: CountUserResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    count() {
        return this.user.count()
    }

    @Get(':id')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get a single user by ID' })
    @ApiResponse({ status: 200, description: 'Return the user.', type: UserWithRelationsEntity })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    findOne(@Param('id') id: string) {
        return this.user.findOne(id)
    }

    @Patch(':id')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserEntity })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.update(id, dto, currentUserId)
    }

    @Delete(':id')
    @Permissions('manage:user')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a user (soft delete)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.', type: DeleteUserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    remove(@Param('id') id: string, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.remove(id, currentUserId)
    }
}
