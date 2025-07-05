import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, decryptToken } from '@/lib/auth'

interface MyParams {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: MyParams) {
  // Authenticate user
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Only PESERTA can absen
  if (typeof userPayload !== 'object' || userPayload.role !== 'PESERTA') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const userId = userPayload.id
  const jadwalId = (await params).id

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { status } = body
  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 })
  }

  try {
    // Prevent duplicate absen for same jadwal & user
    const existing = await prisma.absensi.findFirst({
      where: { userId, jadwalId, deleted: false }
    })
    if (existing) {
      return NextResponse.json({ error: 'Already absen for this jadwal' }, { status: 409 })
    }
    const absen = await prisma.absensi.create({
      data: {
        status,
        userId,
        jadwalId,
        createdBy: userId,
        updatedBy: userId
      },
      include: {
        jadwal: {
          include: {
            admin: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    })
    return NextResponse.json({ data: absen }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}