import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { OnlyForAdmin, decryptToken } from '@/lib/auth'

// GET: Get materi by id
interface MyParams {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: MyParams) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
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

// PATCH: Update materi by id
export async function PATCH(req: NextRequest, { params }: MyParams) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const { judul, deskripsi, category, subject, priority } = await req.json()
    const materi = await prisma.materi.update({
      where: { id },
      data: { judul, deskripsi, category, subject, priority },
    })
    return NextResponse.json(materi)
  } catch (error) {
    return NextResponse.json({ message: 'Error updating materi', error }, { status: 500 })
  }
}

// DELETE: Soft delete materi by id
export async function DELETE(req: NextRequest, { params }: MyParams) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = req.cookies.get('token')?.value
    const user = token ? decryptToken(token) : null
    const { id } = await params
    const materi = await prisma.materi.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: user?.id || null
      }
    })
    return NextResponse.json({ message: 'Materi deleted', materi })
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting materi', error }, { status: 500 })
  }
}
