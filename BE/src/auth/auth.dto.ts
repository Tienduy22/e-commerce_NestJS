import { UserStatus } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    roleId: z.number(),
    avatar: z.string().nullable(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    name: z.string().min(1).max(100),
    phoneNumber: z.string().min(10).max(15),
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'Password and Confirm Password do not match',
            path: ['confirmPassword'],
        })
    }
});

export class RegisterBodyDTO extends createZodDto(registerBodySchema) {}

export class RegisterReDTO extends createZodDto(UserSchema) {}