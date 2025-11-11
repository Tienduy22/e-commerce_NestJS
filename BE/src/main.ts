import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true, // Nếu có thuộc tính không được định nghĩa trong DTO thì sẽ báo lỗi

        exceptionFactory: (validationErrors) => {
            return new UnprocessableEntityException(
                validationErrors.map((error) => ({
                    field: error.property,
                    error: Object.values(error.constraints as any).join(', ')
                })),
            )
        },
    }))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
