import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UserService } from './user.service';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(private readonly user: UserService) { }

    @Post()
    @Permissions('manage:user')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() dto: CreateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.create(dto, currentUserId)
    }

    @Get()
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get all users' })
    findAll() {
        return this.user.findAll()
    }

    @Get(':id')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get a single user by ID' })
    findOne(@Param('id') id: string) {
        return this.user.findOne(id)
    }

    @Patch(':id')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Update a user' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.update(id, dto, currentUserId)
    }

    @Delete(':id')
    @Permissions('manage:user')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a user (soft delete)' })
    remove(@Param('id') id: string, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.remove(id, currentUserId)
    }

    @Get('total')
    @Permissions('manage:user')
    @ApiOperation({ summary: 'Get total users' })
    count() {
        return this.user.count()
    }
}
