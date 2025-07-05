import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, decryptToken } from '@/lib/auth'

interface MyParams {
  params: Promise<{ id: string }>
}

// GET: Get jadwal absensi by id
export async function GET(req: NextRequest, { params }: MyParams) {
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const jadwal = await prisma.jadwalAbsensi.findUnique({ where: { id } })
    if (!jadwal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ data: jadwal }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update jadwal absensi by id
export async function PATCH(req: NextRequest, { params }: MyParams) {
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const decoded = typeof userPayload === 'string' ? null : userPayload
  if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'PENGAJAR')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  try {
    const body = await req.json()
    const { title, description, tanggal } = body
    if (!title && !description && !tanggal) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }
    // Validate tanggal if provided
    if (tanggal && new Date(tanggal) <= new Date()) {
      return NextResponse.json({ error: 'Invalid tanggal' }, { status: 400 })
    }
    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (tanggal) updateData.tanggal = new Date(tanggal)
    updateData.updatedAt = new Date()
    updateData.deleted = false
    const jadwal = await prisma.jadwalAbsensi.update({
      where: { id },
      data: updateData
    })
    return NextResponse.json({ data: jadwal }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Soft delete jadwal absensi by id
export async function DELETE(req: NextRequest, { params }: MyParams) {
  const userPayload = verifyToken(req)
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const decoded = typeof userPayload === 'string' ? null : userPayload
  if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'PENGAJAR')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  try {
    const jadwal = await prisma.jadwalAbsensi.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: decoded.id,
      }
    })
    return NextResponse.json({ data: jadwal }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
