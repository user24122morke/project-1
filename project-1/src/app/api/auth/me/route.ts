import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Authorization token is missing" },
      { status: 401 }
    );
  }

  try {
    // Decodăm token-ul JWT
    console.log(token);
    
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    
    return NextResponse.json({
      message: "User authenticated",
      user: decoded, // Returnăm datele utilizatorului din token
    });
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
