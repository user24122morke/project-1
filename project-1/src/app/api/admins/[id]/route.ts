import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";


export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();

    // Validează ID-ul
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Construiește dinamic obiectul pentru actualizare
    const updateData: Record<string, any> = {};
    for (const key in fields) {
      if (fields[key] !== undefined) {
        updateData[key] = fields[key];
      }
    }

    // Dacă este prezent câmpul `password`, criptează-l
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    // Actualizează în baza de date
    const updatedUser = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}




export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is missing" },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, SECRET_KEY); // Verify token
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = params;

    await prisma.admin.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
  