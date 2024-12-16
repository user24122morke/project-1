import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obține toți adminii
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
