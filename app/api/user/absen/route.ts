import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, decryptToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // Verify JWT from cookies
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all jadwal absensi that are not deleted
    const jadwals = await prisma.jadwalAbsensi.findMany({
      where: { deleted: false },
      orderBy: { tanggal: 'desc' },
      include: {
        admin: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    return NextResponse.json({ data: jadwals }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}