import { validateToken } from "@/app/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authResult = await validateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Returnăm eroarea dacă token-ul este invalid
  }

  try {
    const admins = await prisma.admin.findMany({
      include: { cards: true },
    });

    return NextResponse.json(admins, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Eroare la API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
