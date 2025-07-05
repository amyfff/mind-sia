import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { OnlyForAdmin, decryptToken } from '@/lib/auth'

// GET: Get all materi
export async function GET(req: NextRequest) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
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

// POST: Create new materi
export async function POST(req: NextRequest) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = req.cookies.get('token')?.value
    const user = token ? decryptToken(token) : null
    if (!user) {
      return NextResponse.json({ message: 'Invalid user' }, { status: 401 })
    }
    const { judul, deskripsi, category, subject, priority } = await req.json()
    if (!judul || !deskripsi || !category || !subject || !priority) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }
    const materi = await prisma.materi.create({
      data: {
        judul,
        deskripsi,
        category,
        subject,
        priority,
        pengajarId: user.id
      }
    })
    return NextResponse.json(materi, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating materi', error }, { status: 500 })
  }
}
