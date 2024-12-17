import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "super-admin";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "nakdwdwkfwpffaofwonAKDJAWKDWDFJ";

  // Verifică dacă există deja un super admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: superAdminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    await prisma.admin.create({
      data: {
        username: superAdminUsername,
        password: hashedPassword,
        desk: "ro",
        role: "admin",
      },
    });
    console.log("Super Admin created successfully!");
  } else {
    console.log("Super Admin already exists.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
