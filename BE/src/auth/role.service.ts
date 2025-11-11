import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from './../shared/services/prisma.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesService {
    private clientRoleId: number | null = null

    constructor(private readonly prismaService: PrismaService) {}

    async getClientRoleId() {
        if(this.clientRoleId){
            return this.clientRoleId
        }

        const clientRole = await this.prismaService.role.findUniqueOrThrow({
            where: {
                name: RoleName.CLIENT
            }
        })

        this.clientRoleId = clientRole.id   
        return clientRole.id
    }
}