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
    // Obține token-ul din cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is missing" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      // Verificăm structura payload-ului token-ului
      if (typeof decoded !== "object" || !("id" in decoded)) {
        return NextResponse.json(
          { message: "Invalid token payload" },
          { status: 401 }
        );
      }

      const decodedPayload = decoded as JwtPayload;

      // Comparăm ID-ul din token cu adminId-ul primit în request
      if (decodedPayload.id !== parseInt(params.adminId)) {
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

    // Token valid, continuăm cu preluarea datelor
    const { adminId } = params;

    const cards = await prisma.card.findMany({
      where: { createdBy: parseInt(adminId) },
    });

    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin cards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Închidem conexiunea cu baza de date
  }
}
