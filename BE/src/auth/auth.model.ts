import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import z, { boolean } from "zod";

// ====== Register ====== //

export const RegisterBodySchema = UserSchema.pick({
    email: true,
    password: true,
    name: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6)
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'Password and Confirm Password do not match',
            path: ['confirmPassword'],
        })
    }
});

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const registerReSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
});

export type RegisterReType = z.infer<typeof registerReSchema>;

export const VerificationCodeSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
    expiresAt: z.date(),
    createdAt: z.date(),
}); 

// ====== Login ====== //

export const LoginBodySchema = UserSchema.pick({
    email: true,
    password: true,
}).strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginReSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
})

export type LoginReType = z.infer<typeof LoginReSchema>

// ====== VerificationCode ====== //

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export const SendOTPBodySchema = VerificationCodeSchema.pick({
    email: true,
    type: true,
}).strict()

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;

// ====== RefreshToken ====== //

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>

export const RefreshTokenBodySchema = z.object({
    refreshToken: z.string()
}).strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

export const RefreshTokenResSchema = LoginReSchema

export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>

// ====== Device ====== //

export const DeviceSchema = z.object({
    id: z.number(),
    userId: z.number(),
    userAgent: z.string(),
    ip: z.string(),
    lastActive: z.date(),
    createdAt: z.date(),
    isActive: boolean(),
})

export type DeviceSchemaType = z.infer<typeof DeviceSchema>

// ====== Logout ====== //

export const LogoutBodySchema = RefreshTokenBodySchema

export type LogoutBodyType = z.infer<typeof LogoutBodySchema>