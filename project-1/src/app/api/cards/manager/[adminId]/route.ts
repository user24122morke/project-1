import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is missing" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      // Verificăm dacă decoded este de tip JwtPayload
      if (typeof decoded !== "object" || !("id" in decoded)) {
        return NextResponse.json(
          { message: "Invalid token payload" },
          { status: 401 }
        );
      }

      // Comparăm ID-ul din token cu adminId-ul din request
      if (decoded.id !== parseInt(params.adminId)) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Dacă token-ul este valid și autorizarea a reușit, preluăm datele
    const { adminId } = params;

    const cards = await prisma.card.findMany({
      where: { createdBy: parseInt(adminId) },
    });

    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching manager cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
