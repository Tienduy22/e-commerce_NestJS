import { Body, Controller, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, RegisterBodyDTO, RegisterReDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ZodSerializerDto(RegisterReDTO)
    async register(@Body() body: RegisterBodyDTO){
        return await this.authService.register(body);
    }

    @Post('otp')
    async sendOTP(@Body() body: SendOTPBodyDTO){
        return await this.authService.sendOTP(body);
    }

    @Post('login')
    async login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string){
        return await this.authService.login({
            ...body,
            userAgent,
            ip
        })
    }
}
