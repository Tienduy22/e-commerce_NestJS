import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

export function createCustomZodValidationPipe() {
    return createZodValidationPipe({
        createValidationException: (error: ZodError) => {
            return new UnprocessableEntityException(
                error.issues.map((i) => ({
                    path: i.path.join('.'),
                    message: i.message,
                })),
            )
        },
    })
}
