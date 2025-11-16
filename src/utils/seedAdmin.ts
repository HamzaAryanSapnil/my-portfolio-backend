import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export const seedAdmin = async () => {
  const adminEmail = "admin@portfolio.com";
  const adminPassword = "admin123"; // চাইলে env এ নিতে পারেন

  const isAdminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (isAdminExists) {
    console.log("✔️ Admin credential already has been seeded.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      needPasswordChange: false,
      admin: {
        create: {
          name: "Portfolio Admin",
          contactNumber: "00000000000",
        },
      },
    },
  });

  console.log("🎉 Admin credential has been seeded successfully.");
};
