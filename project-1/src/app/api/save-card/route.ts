import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { cardNumber, cardType, amount, expDate, cvv, holder, country } = await req.json();

    // Salvarea datelor în baza de date folosind Prisma
    const newCard = await prisma.card.create({
      data: {
        cardNumber,
        cardType,
        amount: parseFloat(amount),
        expDate,
        cvv,
        holder,
        country,
      },
    });

    return NextResponse.json({ message: "Card data saved successfully", card: newCard }, { status: 200 });
  } catch (error) {
    console.error("Error saving card data:", error);
    return NextResponse.json({ message: "Failed to save card data" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Închide conexiunea la baza de date
  }
}
