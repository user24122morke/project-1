import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, password, desk } = await req.json();

    // Verifică dacă utilizatorul există deja
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
    }

    // Validează desk (țara)
    const validDesks = ["ro", "it", "de", "fr", "es", "pl", "nl"];
    if (!validDesks.includes(desk)) {
      return NextResponse.json({ message: "Invalid desk value" }, { status: 400 });
    }

    // Hash parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creare utilizator cu rol "manager"
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        desk,
        role: "manager", // Rol implicit
      },
    });

    return NextResponse.json({ message: "Admin created successfully!", admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
