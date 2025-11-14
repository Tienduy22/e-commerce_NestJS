// ...existing code...
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { SharedUserRepository } from './repositories/shared-user.repo';
import { JwtModule } from '@nestjs/jwt';
import envConfig from './config';

const sharedServices = [PrismaService, HashingService, SharedUserRepository];

@Global()
@Module({
    imports: [JwtModule.register({
        secret: envConfig.ACCESS_TOKEN_SECRET,
        signOptions: {
            expiresIn: '1d',
            algorithm: 'HS256',
        },
    })],
    providers: sharedServices,
    exports: [...sharedServices, JwtModule],
})
export class SharedModule { }