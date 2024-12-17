import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // JWT pentru token
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Caută utilizatorul în baza de date
    const user = await prisma.admin.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // Verifică parola folosind bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Generează un token JWT care include rolul
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, // Adăugăm rolul în token
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Returnează token-ul, userId și rolul
    return NextResponse.json(
      { 
        message: "Login successful", 
        token: token, 
        userId: user.id,
        role: user.role // Trimitem și rolul
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
