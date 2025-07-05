export interface JadwalAbsensi {
  id: string;
  title: string;
  description: string;
  tanggal: string;
  createdBy: string;
  createdByName?: string; // Add this field to show creator name
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  category: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  createdBy: string;
  createdByName?: string; // Add this field to show creator name
}

export interface AbsensiRecord {
  id: string;
  jadwalId: string;
  userId: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT';
  timestamp: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'peserta' | 'pengajar' | 'admin';
  createdAt: string;
}

// Mock data
export const mockJadwalAbsensi: JadwalAbsensi[] = [
  {
    id: '1',
    title: 'Pertemuan 1',
    description: 'Pertemuan pertama untuk pelatihan dasar React',
    tanggal: '2025-01-15',
    createdBy: '2',
    createdByName: 'Jane Smith'
  },
  {
    id: '2',
    title: 'Pertemuan 2',
    description: 'Pertemuan kedua untuk pelatihan lanjutan',
    tanggal: '2025-01-20',
    createdBy: '2',
    createdByName: 'Jane Smith'
  }
];

export const mockMateri: Materi[] = [
  {
    id: '1',
    judul: 'Trigonometri Dasar',
    deskripsi: 'Materi ini membahas konsep dasar trigonometri.',
    category: 'Basic',
    subject: 'Matematika',
    priority: 'High',
    createdBy: '2',
    createdByName: 'Jane Smith'
  },
  {
    id: '2',
    judul: 'Intro to Tailwind',
    deskripsi: 'Dasar penggunaan TailwindCSS untuk styling',
    category: 'Web Development',
    subject: 'Programming',
    priority: 'Medium',
    createdBy: '2',
    createdByName: 'Jane Smith'
  }
];

export const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'peserta@example.com',
    role: 'peserta',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'pengajar@example.com',
    role: 'pengajar',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'peserta',
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: '5',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'pengajar',
    createdAt: '2024-01-18T14:00:00Z'
  }
];

export const mockAbsensi: AbsensiRecord[] = [];

// Helper function to get user name by ID
const getUserNameById = (userId: string): string => {
  const user = mockUsers.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
};

// API functions
export const getJadwalAbsensi = async (): Promise<JadwalAbsensi[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Add creator names to the response
  return mockJadwalAbsensi.map(jadwal => ({
    ...jadwal,
    createdByName: getUserNameById(jadwal.createdBy)
  }));
};

export const createJadwalAbsensi = async (data: Omit<JadwalAbsensi, 'id' | 'createdByName'>): Promise<JadwalAbsensi> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newJadwal: JadwalAbsensi = {
    id: Date.now().toString(),
    ...data,
    createdByName: getUserNameById(data.createdBy)
  };
  mockJadwalAbsensi.push(newJadwal);
  return newJadwal;
};

export const updateJadwalAbsensi = async (id: string, data: Partial<Omit<JadwalAbsensi, 'id' | 'createdByName'>>): Promise<JadwalAbsensi> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockJadwalAbsensi.findIndex(j => j.id === id);
  if (index === -1) {
    throw new Error('Jadwal not found');
  }
  
  mockJadwalAbsensi[index] = { 
    ...mockJadwalAbsensi[index], 
    ...data,
    createdByName: data.createdBy ? getUserNameById(data.createdBy) : mockJadwalAbsensi[index].createdByName
  };
  return mockJadwalAbsensi[index];
};

export const deleteJadwalAbsensi = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockJadwalAbsensi.findIndex(j => j.id === id);
  if (index > -1) {
    mockJadwalAbsensi.splice(index, 1);
  }
};

export const getMateri = async (): Promise<Materi[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Add creator names to the response
  return mockMateri.map(materi => ({
    ...materi,
    createdByName: getUserNameById(materi.createdBy)
  }));
};

export const createMateri = async (data: Omit<Materi, 'id' | 'createdByName'>): Promise<Materi> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newMateri: Materi = {
    id: Date.now().toString(),
    ...data,
    createdByName: getUserNameById(data.createdBy)
  };
  mockMateri.push(newMateri);
  return newMateri;
};

export const updateMateri = async (id: string, data: Partial<Omit<Materi, 'id' | 'createdByName'>>): Promise<Materi> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockMateri.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Materi not found');
  }
  
  mockMateri[index] = { 
    ...mockMateri[index], 
    ...data,
    createdByName: data.createdBy ? getUserNameById(data.createdBy) : mockMateri[index].createdByName
  };
  return mockMateri[index];
};

export const deleteMateri = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockMateri.findIndex(m => m.id === id);
  if (index > -1) {
    mockMateri.splice(index, 1);
  }
};

export const submitAbsensi = async (jadwalId: string, userId: string, status: 'HADIR' | 'IZIN' | 'SAKIT'): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove existing record if any
  const existingIndex = mockAbsensi.findIndex(a => a.jadwalId === jadwalId && a.userId === userId);
  if (existingIndex > -1) {
    mockAbsensi.splice(existingIndex, 1);
  }
  
  // Add new record
  mockAbsensi.push({
    id: Date.now().toString(),
    jadwalId,
    userId,
    status,
    timestamp: new Date().toISOString()
  });
};

// User management functions
export const getUsers = async (): Promise<UserData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

export const createUser = async (data: Omit<UserData, 'id' | 'createdAt'>): Promise<UserData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const newUser: UserData = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, data: Partial<Omit<UserData, 'id' | 'createdAt'>>): Promise<UserData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  
  // Check if email already exists (excluding current user)
  if (data.email) {
    const existingUser = mockUsers.find(u => u.email === data.email && u.id !== id);
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }
  
  mockUsers[index] = { ...mockUsers[index], ...data };
  return mockUsers[index];
};

export const deleteUser = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockUsers.findIndex(u => u.id === id);
  if (index > -1) {
    mockUsers.splice(index, 1);
  }
};