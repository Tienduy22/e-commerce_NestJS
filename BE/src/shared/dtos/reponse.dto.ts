import { createZodDto } from "nestjs-zod";
import { MessageReSchema } from "../models/response.model";

export class MessageResDTO extends createZodDto(MessageReSchema) {}