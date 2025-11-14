import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { DeviceSchemaType, RefreshTokenResType, RefreshTokenType, RegisterBodyType, VerificationCodeType } from "./auth.model";
import { UserType } from "src/shared/models/shared-user.model";
import { TypeOfVerificationCodeType } from "src/shared/constants/auth.constant";
import { RefreshToken } from "@prisma/client";
import { RoleType } from "src/shared/types/role.type";

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async createUser(user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>)
        : Promise<Omit<UserType, 'password' | 'totpSecret'>> {
        return this.prismaService.user.create({
            data: user,
            omit: {
                password: true,
                totpSecret: true
            },
        })
    }

    async createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>)
        : Promise<VerificationCodeType> {
        return this.prismaService.verificationCode.upsert({
            where: {
                email: payload.email
            },
            create: payload,
            update: {
                code: payload.code,
                expiresAt: payload.expiresAt
            }
        })
    }

    async findVerificationCode(uniqueValue: { email: string } | { id: number } | {
        email: string,
        code: string,
        type: TypeOfVerificationCodeType
    })
        : Promise<VerificationCodeType | null> {
        return this.prismaService.verificationCode.findUnique({
            where: uniqueValue,
        })
    }

    async createRefreshToken(data: { token: string, userId: number, expiresAt: Date, deviceId: number }) {
        return this.prismaService.refreshToken.create({
            data,
        })
    }

    // Partial tự động set giá trị
    async createDevice(data: Pick<DeviceSchemaType, 'userId' | 'userAgent' | 'ip'>
        & Partial<Pick<DeviceSchemaType, 'lastActive' | 'isActive'>>) {
        return this.prismaService.device.create({
            data
        })
    }

    async findUniqueRefreshTokenIncludeUserRole(uniqueObject: { token: string })
        : Promise<RefreshTokenType & { user: UserType & { role: RoleType } } | null> {
        return this.prismaService.refreshToken.findUnique({
            where: uniqueObject,
            include: {
                user: {
                    include: {
                        role: true,
                    }
                }
            }
        })
    }

    async updateDevice(deviceId: number, data: Partial<DeviceSchemaType>)
        : Promise<DeviceSchemaType> {
        return this.prismaService.device.update({
            where: {
                id: deviceId
            },
            data
        })
    }

    async deleteRefreshToken(uniqueObject: {token: string}): Promise<RefreshTokenType>{
        return this.prismaService.refreshToken.delete({
            where: uniqueObject
        })
    }
}   