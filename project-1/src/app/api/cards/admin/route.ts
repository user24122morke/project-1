import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
        include: { cards: true },
      });
      console.log(admins);
      
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
