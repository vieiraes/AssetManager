import { prisma } from '../db'

export async function clearDatabase() {
    await prisma.asset.deleteMany()
    await prisma.wallet.deleteMany()
    await prisma.user.deleteMany()
}
clearDatabase()
    .catch((e) => { console.error(e.message) }).then(async () => {
        await prisma.$disconnect()
        console.info('database cleared')
    })