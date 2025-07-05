import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function verifyJWT(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (error) {
    return null
  }
}
export function verifyToken(req: NextRequest): string | jwt.JwtPayload | null {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return verifyJWT(token)
}

export function OnlyForAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('token')?.value
  if (!token) return false
  const decoded = decryptToken(token)
  return decoded?.role === 'PENGAJAR' || decoded?.role === 'ADMIN'
}

export function decryptToken(token: string): { id: string; email: string; role: string ; name: string, kelas: string, nim: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: string, name: string, kelas: string, nim: string }
    return decoded
  } catch (error) {
    console.error('Token decryption error:', error)
    return null
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
export type UserRole = 'peserta' | 'pengajar' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'peserta@example.com',
    role: 'peserta',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'pengajar@example.com',
    role: 'pengajar',
    password: 'password123'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password123'
  }
];

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const register = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    role
  };
  
  mockUsers.push({ ...newUser, password });
  return newUser;
};