import z from "zod";

export const MessageReSchema = z.object({
    message: z.string(),
})

export type MessageReSchemaType = z.infer<typeof MessageReSchema>