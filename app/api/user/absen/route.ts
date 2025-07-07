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
  // Extract userId and role from userPayload (handle string or object)
  let userId: string | undefined
  let userRole: string | undefined
  if (typeof userPayload === 'string') {
    try {
      const parsed = JSON.parse(userPayload)
      userId = parsed.id
      userRole = parsed.role
    } catch {
      userId = undefined
      userRole = undefined
    }
  } else {
    userId = (userPayload as any).id
    userRole = (userPayload as any).role
  }
  if (!userId) {
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

    // If user is PESERTA, check absen status for each jadwal
    if (userRole && userRole.toLowerCase() === 'peserta') {
      const jadwalsWithAbsen = await Promise.all(jadwals.map(async (jadwal) => {
        const absen = await prisma.absensi.findFirst({
          where: {
            jadwalId: jadwal.id,
            userId: userId,
            deleted: false
          }
        })
        return {
          ...jadwal,
          alreadyAbsen: !!absen,
          absenStatus: absen ? absen.status : null
        }
      }))
      return NextResponse.json({ data: jadwalsWithAbsen }, { status: 200 })
    } else {
      // For admin/pengajar, just return jadwal data (no absen fields)
      return NextResponse.json({ data: jadwals }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}