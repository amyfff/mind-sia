// get all user only pengajar or admin
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { OnlyForAdmin, decryptToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const users = await prisma.user.findMany({
      where: {
        deleted: false,
        OR: [
          { role: 'PENGAJAR' },
          { role: 'PESERTA' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 })
  }
}