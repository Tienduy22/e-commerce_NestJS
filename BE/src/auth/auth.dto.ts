import { RegisterBodySchema, registerReSchema } from './auth.model';
import { createZodDto } from "nestjs-zod";


export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterReDTO extends createZodDto(registerReSchema) {}