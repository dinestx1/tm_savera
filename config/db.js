const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function connect() {
  try {
    await prisma.$connect()
    console.log('✅ Prisma connected to DB')
  } catch (err) {
    console.error('❌ Prisma connection failed:', err)
    process.exit(1)
  }
}

module.exports = { prisma, connect }
