import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { RolesService } from './role.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { mapPrismaError } from 'src/shared/utils/prisma-error';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly rolesService: RolesService,
        private readonly prismaService: PrismaService
    ) {}

    async register(body: any) {
        try {
            const clientRoleId = await this.rolesService.getClientRoleId()
            const hashedPassword = await this.hashingService.hash(body.password)

            const user = await this.prismaService.user.create({
                data: ({
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                    phoneNumber: body.phoneNumber,
                    roleId: clientRoleId
                }),
                omit: {
                    password: true,
                    totpSecret: true
                },
            })

            return user
        } catch (error) {
            throw mapPrismaError(error, { entity: 'User' })
        }
    }
}
