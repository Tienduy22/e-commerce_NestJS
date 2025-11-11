import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { RolesService } from './role.service';
import { mapPrismaError } from 'src/shared/utils/prisma-error';
import { RegisterBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly rolesService: RolesService,
        private readonly authRepository: AuthRepository
    ) {}

    async register(body: RegisterBodyType) {
        try {
            const clientRoleId = await this.rolesService.getClientRoleId()
            const hashedPassword = await this.hashingService.hash(body.password)
            return await this.authRepository.createUser({
                email: body.email,
                name: body.name,
                phoneNumber: body.phoneNumber,
                password: hashedPassword,
                roleId: clientRoleId,
            })
        } catch (error) {
            throw mapPrismaError(error, { entity: 'User' })
        }
    }
}
