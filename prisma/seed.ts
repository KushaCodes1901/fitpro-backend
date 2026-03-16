import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@fitpro.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!!--";
  const firstName = process.env.ADMIN_FIRST_NAME || "Shkamb";
  const lastName = process.env.ADMIN_LAST_NAME || "Kurshumlija";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log("Admin user created successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });