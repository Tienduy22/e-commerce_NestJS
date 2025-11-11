import { BadRequestException, ConflictException, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common'
import { Prisma } from '@prisma/client'


export const isPrismaKnownError = (e: unknown): e is Prisma.PrismaClientKnownRequestError =>
    e instanceof Prisma.PrismaClientKnownRequestError

export const isUniqueConstraintError = (e: unknown) =>
    isPrismaKnownError(e) && e.code === 'P2002'

export const isNotFoundError = (e: unknown) =>
    isPrismaKnownError(e) && e.code === 'P2025'

export const isForeignKeyError = (e: unknown) =>
    isPrismaKnownError(e) && e.code === 'P2003'

export function mapPrismaError(e: unknown, ctx?: { entity?: string }): HttpException {
    if (isUniqueConstraintError(e)) {
        const target = (e as Prisma.PrismaClientKnownRequestError).meta?.target as string[] | undefined
        const field = target?.join(', ') || 'unique field'
        return new ConflictException(`${ctx?.entity ?? 'Record'} với ${field} đã tồn tại`)
    }

    if (isNotFoundError(e)) {
        return new NotFoundException(`${ctx?.entity ?? 'Record'} không tồn tại`)
    }

    if (isForeignKeyError(e)) {
        return new BadRequestException(`Dữ liệu không hợp lệ (ràng buộc khóa ngoại)`)
    }

    return new InternalServerErrorException('Đã xảy ra lỗi hệ thống')
}
