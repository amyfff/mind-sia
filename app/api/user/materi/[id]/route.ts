import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Get materi by id
interface MyParams {
  params: Promise<{ id: string }>
}
export async function GET(req: NextRequest, { params }: MyParams) {
  try {
    const { id } = await params
    const materi = await prisma.materi.findUnique({
      where: { id, deleted: false },
      include: { pengajar: { select: { id: true, name: true, email: true } } }
    })
    if (!materi) {
      return NextResponse.json({ message: 'Materi not found' }, { status: 404 })
    }
    return NextResponse.json(materi)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching materi', error }, { status: 500 })
  }
}