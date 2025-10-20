import { PrismaClient, Role, Severity } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Users
  const password = await bcrypt.hash('password123', 10)
  const [viewer, analyst, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'viewer@sirt.local' },
      update: {},
      create: { email: 'viewer@sirt.local', password, role: 'VIEWER' as Role },
    }),
    prisma.user.upsert({
      where: { email: 'analyst@sirt.local' },
      update: {},
      create: {
        email: 'analyst@sirt.local',
        password,
        role: 'ANALYST' as Role,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@sirt.local' },
      update: {},
      create: { email: 'admin@sirt.local', password, role: 'ADMIN' as Role },
    }),
  ])

  // Incidents
  for (let i = 1; i <= 6; i++) {
    await prisma.incident.create({
      data: {
        title: `Server outage #${i}`,
        description: `Example incident description number ${i}.`,
        severity: (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Severity[])[i % 4],
        reporterId: viewer.id,
        assigneeId: analyst.id,
      },
    })
  }
}

main().finally(() => prisma.$disconnect())
