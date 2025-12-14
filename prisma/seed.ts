import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })

    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Demo User',
            password,
            role: 'USER',
        },
    })

    console.log({ admin, user })

    // Seed products
    const products = [
        {
            name: 'Wireless Headphones',
            description: 'High quality wireless headphones with noise cancellation.',
            price: 199.99,
            stock: 50,
            category: 'Electronics',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        },
        {
            name: 'Smart Watch',
            description: 'Track your fitness and stay connected.',
            price: 299.99,
            stock: 30,
            category: 'Electronics',
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        },
        {
            name: 'Running Shoes',
            description: 'Comfortable running shoes for long distances.',
            price: 89.99,
            stock: 100,
            category: 'Sports',
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
        },
    ]

    for (const product of products) {
        await prisma.product.create({
            data: product,
        })
    }

    console.log('Seeded products')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
