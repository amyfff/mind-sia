import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Get user by id
interface MyParams {
    params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: MyParams) {
    try {
        const { id } = await params
        const user = await prisma.user.findUnique({
            where: { id, deleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }
        if (user.role === 'ADMIN' || user.role === 'PENGAJAR') {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching user', error }, { status: 500 })
    }
}