import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { RefreshToken } from './../../node_modules/.prisma/client/index.d';
import { compare } from 'bcrypt';
import { TokenService } from './../shared/services/token.service';
import { addMilliseconds } from 'date-fns';
import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { RolesService } from './role.service';
import { mapPrismaError } from 'src/shared/utils/prisma-error';
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType, SendOTPBodyType, VerificationCodeType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { generateOTP } from 'src/shared/helpers';
import ms from 'ms';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { AccessTokenPayloadCreate } from 'src/shared/types/token.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly rolesService: RolesService,
        private readonly authRepository: AuthRepository,
        private readonly sharedUserRepo: SharedUserRepository,
        private readonly tokenService: TokenService
    ) { }

    async register(body: RegisterBodyType) {
        try {
            const verificationCode = await this.authRepository.findVerificationCode({
                email: body.email,
                code: body.code,
                type: TypeOfVerificationCode.REGISTER,
            })
            if (verificationCode == null) {
                throw new UnprocessableEntityException({
                    message: "Mã OTP không hợp lệ",
                    path: 'code'
                })
            }
            if (verificationCode.expiresAt < new Date()) {
                throw new UnprocessableEntityException({
                    message: "Mã OTP hết hạn",
                    path: 'code'
                })
            }
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
            if (error instanceof HttpException) {
                throw error
            }
            throw mapPrismaError(error, { entity: 'User' })
        }
    }

    async sendOTP(body: SendOTPBodyType) {
        const user = await this.sharedUserRepo.findUnique({
            email: body.email
        })
        if (user) {
            throw new UnprocessableEntityException([
                {
                    message: "Email đã tồn tại",
                    path: "email"
                }
            ])
        }
        const code = generateOTP()
        const verificationCode = await this.authRepository.createVerificationCode({
            email: body.email,
            code,
            type: body.type,
            expiresAt: addMilliseconds(new Date(), ms('5m'))
        })

        return verificationCode
    }

    async login(body: LoginBodyType & { userAgent: string, ip: string }) {
        const user = await this.sharedUserRepo.findUnique({
            email: body.email
        })
        if (!user) {
            throw new UnprocessableEntityException({
                message: 'Email không đúng',
                path: 'email'
            })
        }
        const comparePassword = await this.hashingService.compare(body.password, user.password)
        if (!comparePassword) {
            throw new UnprocessableEntityException({
                message: 'Mật khẩu không chính xác',
                path: 'password'
            })
        }
        const device = await this.authRepository.createDevice({
            userId: user.id,
            userAgent: body.userAgent,
            ip: body.ip
        })
        const token = await this.generateToken({
            userId: user.id,
            deviceId: device.id,
            roleId: user.roleId
        })
        return token
    }

    async generateToken({ userId, deviceId, roleId }: AccessTokenPayloadCreate) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken({
                userId,
                deviceId,
                roleId
            }),
            this.tokenService.signRefreshToken({
                userId
            })
        ])
        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.authRepository.createRefreshToken({
            token: refreshToken,
            userId,
            expiresAt: new Date(decodedRefreshToken.exp * 1000),
            deviceId
        })
        return { accessToken, refreshToken }
    }

    async refreshToken({
        refreshToken,
        userAgent,
        ip
    }: RefreshTokenBodyType & { userAgent: string, ip: string }) {
        try {
            // 1 Kiểm tra refreshToken có hợp lệ không
            const {userId} = await this.tokenService.verifyRefreshToken(refreshToken)
            // 2 Kiểm tra refreshToken có tồn tại trong DB không
            const refreshTokenInDB = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
                token: refreshToken
            })
            if(!refreshTokenInDB){
                throw new UnauthorizedException("RefreshToken đã được sử dụng")
            }
            // 3 Cập nhật device
            const {deviceId, user: {roleId}} = refreshTokenInDB
            const $updateDevice = this.authRepository.updateDevice(deviceId,{
                userId,
                ip,
                userAgent,
            })
            // 4 Xóa refreshToken cũ
            const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
                token: refreshToken
            })
            // 5 Tạo mới accessToken và refreshToken
            const $tokens = this.generateToken({userId, roleId, deviceId})
            const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])
            return tokens
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new UnauthorizedException()
        }
    }
}
