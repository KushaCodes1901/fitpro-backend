const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fitpro.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const password = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      email: adminEmail,
      fullName: 'FitPro Admin',
      role: 'ADMIN',
      password,
    },
  });

  console.log(`Admin created: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
