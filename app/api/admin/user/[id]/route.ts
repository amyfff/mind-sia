import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { OnlyForAdmin, decryptToken } from '@/lib/auth'
import { Role } from '@prisma/client';

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
    const user = await prisma.user.findUnique({
      where: { id, deleted: false }
    })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user', error }, { status: 500 })
  }
}

// PATCH: Update user by id
export async function PATCH(req: NextRequest, { params }: MyParams) {
  try {
    if (!OnlyForAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...body,
        role: body.role ? Role[body.role.toUpperCase() as keyof typeof Role] : undefined,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 })
  }
}

// DELETE: Soft delete user by id
export async function DELETE(req: NextRequest, { params }: MyParams) {
    try {
        if (!OnlyForAdmin(req)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const token = req.cookies.get('token')?.value
        const userPayload = token ? decryptToken(token) : null
        const deletedBy = userPayload ? userPayload.id : null
        const { id } = await params
        const user = await prisma.user.update({
            where: { id },
            data: { deleted: true, deletedBy }
        })
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 })
    }
}
