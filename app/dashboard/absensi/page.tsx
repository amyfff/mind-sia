"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserCheck, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';

interface Admin {
  name: string;
  email: string;
}

interface Jadwal {
  title: string;
  description: string;
  tanggal: string;
  createdAt: string;
  createdBy: string;
  admin: Admin;
}

interface Absensi {
  id: string;
  status: string;
  jadwalId: string;
  createdAt: string;
  jadwal?: Jadwal;
}

interface UserAbsensi {
  id: string;
  name: string;
  email: string;
  role: string;
  absensi: Absensi[];
}

export default function AbsensiPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [usersAbsensi, setUsersAbsensi] = useState<UserAbsensi[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    if (user?.role === 'ADMIN') {
      fetchAbsensi();
    }
    // eslint-disable-next-line
  }, [user, router]);

  const fetchAbsensi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/absen/user');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch');
      }
      const data = await res.json();
      setUsersAbsensi(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
        <div className="mb-2 font-bold">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Absensi Users</h1>
          <p className="text-gray-600 mt-2">View all user attendance records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{usersAbsensi.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Absensi</p>
                <p className="text-3xl font-bold">{usersAbsensi.reduce((acc, u) => acc + u.absensi.length, 0)}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Unique Jadwal</p>
                <p className="text-3xl font-bold">{
                  Array.from(new Set(usersAbsensi.flatMap(u => u.absensi.map(a => a.jadwalId)))).length
                }</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {usersAbsensi.length === 0 ? (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>No Absensi Data</CardTitle>
              <CardDescription>No user absensi records found.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          usersAbsensi.map((u) => (
            <Card key={u.id} className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {u.name}
                  <Badge className="ml-2 bg-gray-200 text-gray-700">{u.email}</Badge>
                  <Badge className="ml-2 bg-blue-500 text-white">{u.role}</Badge>
                </CardTitle>
                <CardDescription>User attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                {u.absensi.length === 0 ? (
                  <div className="text-gray-500">No absensi records.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Jadwal Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Admin Email</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {u.absensi.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>
                              <Badge className={
                                a.status === 'HADIR'
                                  ? 'bg-green-500 text-white'
                                  : a.status === 'ALPHA'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-400 text-white'
                              }>
                                {a.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{a.jadwal?.title || '-'}</TableCell>
                            <TableCell>{a.jadwal?.description || '-'}</TableCell>
                            <TableCell>{a.jadwal?.tanggal ? new Date(a.jadwal.tanggal).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                  {a.jadwal?.admin?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="text-sm font-medium">{a.jadwal?.admin?.name || '-'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">{a.jadwal?.admin?.email || '-'}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                }) : '-'}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}