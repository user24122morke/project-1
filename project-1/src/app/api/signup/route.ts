import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, password, desk } = await req.json();

    // Verifică dacă utilizatorul există deja
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: username },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
    }

    // Verifică dacă desk (țara) este validă
    const validDesks = ["ro", "it", "de", "fr", "es", "pl", "nl"];
    if (!validDesks.includes(desk)) {
      return NextResponse.json({ message: "Invalid desk value" }, { status: 400 });
    }

    // Hash-uiește parola folosind bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creează noul admin în baza de date
    const newAdmin = await prisma.admin.create({
      data: {
        username: username,
        password: hashedPassword,
        desk: desk,
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
