import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { AccessTokenPayload, AccessTokenPayloadCreate, RefreshTokenPayload, RefreshTokenPayloadCreate } from "../types/token.type";
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    signAccessToken(payload: AccessTokenPayloadCreate) {
        return this.jwtService.sign({...payload, uuid: uuidv4()})
    }

    signRefreshToken(payload: RefreshTokenPayloadCreate) {
        return this.jwtService.sign({...payload, uuid: uuidv4()})
    }

    verifyAccessToken(token: string): Promise<AccessTokenPayload> {
        return this.jwtService.verifyAsync(token)
    }

    verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        return this.jwtService.verifyAsync(token)
    }
}