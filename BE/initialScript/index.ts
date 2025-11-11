import { HashingService } from './../src/shared/services/hashing.service';
import envConfig from "src/shared/config"
import { RoleName } from "src/shared/constants/role.constant"
import { PrismaService } from "src/shared/services/prisma.service"

const prisma = new PrismaService()
const hashingService = new HashingService()
const main = async () => {
    const roleCount = await prisma.role.count()
    if (roleCount > 0) {
        throw new Error("Role already exists.")
    }

    const roles = await prisma.role.createMany({
        data: [
            { name: RoleName.ADMIN, description: 'Administrator with full access' },
            { name: RoleName.CLIENT, description: 'Client user' },
            { name: RoleName.SELLER, description: 'Seller user' },
        ],
    })

    const adminRole = await prisma.role.findFirstOrThrow({
        where: { name: RoleName.ADMIN },
    })

    const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD)
    const adminUser = await prisma.user.create({
        data: {
            email: envConfig.ADMIN_EMAIL,
            password: hashedPassword,
            name: envConfig.ADMIN_PASSWORD,
            phoneNumber: envConfig.ADMIN_PHONE,
            roleId: adminRole.id
        }
    })

    return { roles, adminUser }
}

main().then(({ roles, adminUser }) => {
    console.log('Create role successfully')
    console.log({ roles, adminUser })
}).catch((error) => {
    console.error(error)
})