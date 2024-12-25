import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie"); // Preia antetul "Cookie"
    if (!cookieHeader) {
      return NextResponse.json(
        { message: "Unauthorized - No cookie" },
        { status: 401 }
      );
    }

    // Extrage cookie-ul "token"
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    console.log("Token cookie:", tokenCookie);

    if (!tokenCookie) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing" },
        { status: 401 }
      );
    }

    const token = tokenCookie.split("=")[1]; // Preia valoarea token-ului
    try {
      // Verifică și decodează token-ul JWT
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log("Decoded token:", decoded);

      // Verifică dacă utilizatorul este autorizat
      if (!decoded || typeof decoded !== "object" || !decoded.role) {
        return NextResponse.json(
          { message: "Unauthorized - Invalid token structure" },
          { status: 401 }
        );
      }

      // Verifică rolul utilizatorului
      if (decoded.role !== "admin" && decoded.role !== "manager") {
        return NextResponse.json(
          { message: "Unauthorized - Insufficient permissions" },
          { status: 403 }
        );
      }

      // Accesăm baza de date pentru a lua datele despre admini și carduri
      const admins = await prisma.admin.findMany({
        include: { cards: true }, // Include cardurile asociate fiecărui admin
      });
      console.log(admins);
      
      return NextResponse.json(
        { message: "Authorized", data: admins },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error decoding token:", err);
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Închidem conexiunea cu baza de date
  }
}
