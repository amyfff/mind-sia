// this route for login user
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { Jwt } from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Return user data without password
    const { password: _, ...userData } = user

    // Generate JWT token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

    // Set token in cookies
    const response = NextResponse.json({
      data: {
        id: user.id, // include id
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    }, { status: 200 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 1 // 1 day
    })
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}