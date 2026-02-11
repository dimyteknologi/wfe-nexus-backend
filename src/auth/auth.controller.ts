import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({ status: 200, description: 'Login successful, returns JWT token.' })
    @ApiResponse({ status: 401, description: 'Invalid Credentials.' })
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto.email, dto.password)
    }
}
