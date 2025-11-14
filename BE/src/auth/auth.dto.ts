import { LoginBodySchema, LoginReSchema, LogoutBodySchema, RefreshTokenBodySchema, RefreshTokenResSchema, RegisterBodySchema, registerReSchema, SendOTPBodySchema } from './auth.model';
import { createZodDto } from "nestjs-zod";

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterReDTO extends createZodDto(registerReSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginReSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}