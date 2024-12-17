import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
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
