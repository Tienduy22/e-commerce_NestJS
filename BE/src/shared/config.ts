import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { config as dotenvConfig } from 'dotenv'

// Nạp file .env
dotenvConfig({ path: '.env' })

// Kiểm tra sự tồn tại của file .env
const envPath = path.resolve('.env')
if (!fs.existsSync(envPath)) {
    console.error('❌ Không tìm thấy file .env')
    process.exit(1)
}

const configSchema = z.object({
    DATABASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    SECRET_API_KEY: z.string(),
    ADMIN_NAME: z.string(),
    ADMIN_PASSWORD: z.string(),
    ADMIN_EMAIL: z.string(),
    ADMIN_PHONE: z.string(),
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
    console.error('❌ Sai định dạng biến môi trường (env)')
    console.error(configServer.error)
    process.exit(1)
}

const envConfig = configServer.data

export default envConfig