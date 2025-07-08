export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, decryptToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // Verify JWT from cookies
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow ADMIN or PENGAJAR
  const decoded = decryptToken(token)
  if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'PENGAJAR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, description, tanggal } = body
    if (!title || !description || !tanggal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create jadwal absensi
    // tanggal must in future
    const inputDate = new Date(tanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset ke awal hari

    if (inputDate < today) {
      return NextResponse.json({ error: 'Invalid tanggal' }, { status: 400 })
    }
    const jadwal = await prisma.jadwalAbsensi.create({
      data: {
        title,
        description,
        tanggal: new Date(tanggal),
        createdBy: decoded.id,
      }
    })
    return NextResponse.json({ data: jadwal }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
