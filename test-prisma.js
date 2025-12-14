const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Prisma client initialized')
    try {
        await prisma.$connect()
        console.log('Connected to DB')
    } catch (e) {
        console.error('Connection failed', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
