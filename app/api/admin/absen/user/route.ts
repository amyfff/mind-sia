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
  const decoded = decryptToken(token)
  if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'PENGAJAR')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Find all users who have at least one absensi (distinct by user)
    const users = await prisma.user.findMany({
      where: {
        absensi: {
          some: {},
        },
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        absensi: {
          select: {
            id: true,
            status: true,
            jadwalId: true,
            createdAt: true,
          },
        },
      },
    })
    return NextResponse.json({ data: users }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
