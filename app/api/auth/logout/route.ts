import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Remove the token cookie by setting it to empty and expired
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire immediately
  })
  return response
}
