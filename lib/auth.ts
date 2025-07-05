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