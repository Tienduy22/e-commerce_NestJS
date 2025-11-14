import z from "zod";
import { UserStatus } from "../constants/auth.constant";

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100),
    phoneNumber: z.string().min(10).max(15),
    roleId: z.number().positive(),
    avatar: z.string().nullable(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
    totpSecret: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
})

export type UserType = z.infer<typeof UserSchema>;