import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Get all materi
export async function GET(req: NextRequest) {
  try {
    const materi = await prisma.materi.findMany({
      where: { deleted: false },
      include: { pengajar: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(materi)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching materi', error }, { status: 500 })
  }
}