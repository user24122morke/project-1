import jwt from "jsonwebtoken";

import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redirecționare la pagina de login dacă token-ul lipsește
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verifică token-ul JWT și decodifică datele
    const decoded = jwt.verify(token, SECRET_KEY);

    // Adaugă datele utilizatorului în antetul cererii
    const res = NextResponse.next();
    res.headers.set("x-user-data", JSON.stringify(decoded)); // Encodează datele utilizatorului
    return res;
  } catch (err) {
    console.error("Invalid token:", err);
    // Redirecționare la login dacă token-ul este invalid
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Configurare pentru a proteja rutele
export const config = {
  matcher: ["/admin/:path*"], // Protejează toate rutele care încep cu /admin
};
