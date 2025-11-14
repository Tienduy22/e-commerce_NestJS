import { RefreshToken } from './../../node_modules/.prisma/client/index.d';
import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, LoginResDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterReDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { HTTPMethod } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ZodSerializerDto(RegisterReDTO)
    async register(@Body() body: RegisterBodyDTO) {
        return await this.authService.register(body);
    }

    @Post('otp')
    async sendOTP(@Body() body: SendOTPBodyDTO) {
        return await this.authService.sendOTP(body);
    }

    @Post('login')
    @ZodSerializerDto(LoginResDTO)
    async login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
        return await this.authService.login({
            ...body,
            userAgent,
            ip
        })
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ZodSerializerDto(RefreshTokenResDTO)
    async refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
        return await this.authService.refreshToken({
            refreshToken: body.refreshToken,
            userAgent,
            ip
        })
    }
}
