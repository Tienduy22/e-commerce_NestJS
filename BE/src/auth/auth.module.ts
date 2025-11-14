// ...existing code...
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesService } from './role.service';
import { AuthRepository } from './auth.repo';
import { TokenService } from 'src/shared/services/token.service';

@Module({
  providers: [AuthService, RolesService, AuthRepository, TokenService],
  controllers: [AuthController]
})
export class AuthModule {}
