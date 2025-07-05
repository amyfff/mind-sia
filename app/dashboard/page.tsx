'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getJadwalAbsensi, submitAbsensi, JadwalAbsensi } from '@/lib/data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jadwalList, setJadwalList] = useState<JadwalAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const data = await getJadwalAbsensi();
        setJadwalList(data);
      } catch (error) {
        console.error('Error fetching jadwal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  const handleSubmitAbsensi = async (jadwalId: string, status: 'HADIR' | 'IZIN' | 'SAKIT') => {
    if (!user) return;
    
    setSubmittingId(jadwalId);
    try {
      await submitAbsensi(jadwalId, user.id, status);
      toast({
        title: 'Success',
        description: `Attendance submitted as ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit attendance',
        variant: 'destructive',
      });
    } finally {
      setSubmittingId(null);
    }
  };

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'peserta':
        return 'Welcome to your learning dashboard';
      case 'pengajar':
        return 'Welcome to your teaching dashboard';
      case 'admin':
        return 'Welcome to the admin dashboard';
      default:
        return 'Welcome to your dashboard';
    }
  };

  const getStatsCards = () => {
    const baseStats = [
      { title: 'Total Jadwal', value: jadwalList.length, icon: Calendar, color: 'bg-blue-500' },
      { title: 'Materi Tersedia', value: '8', icon: BookOpen, color: 'bg-green-500' },
    ];

    if (user?.role === 'admin') {
      baseStats.push({ title: 'Total Users', value: '45', icon: Users, color: 'bg-purple-500' });
    }

    return baseStats;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getStatsCards().map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Jadwal Absensi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Absensi
          </CardTitle>
          <CardDescription>
            {user?.role === 'peserta' 
              ? 'Click the buttons below to submit your attendance'
              : 'Recent attendance schedules'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jadwalList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No schedules available</p>
          ) : (
            <div className="space-y-4">
              {jadwalList.map((jadwal) => (
                <div key={jadwal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{jadwal.title}</h3>
                      <p className="text-gray-600 mt-1">{jadwal.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{jadwal.tanggal}</span>
                      </div>
                    </div>
                    
                    {user?.role === 'peserta' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitAbsensi(jadwal.id, 'HADIR')}
                          disabled={submittingId === jadwal.id}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {submittingId === jadwal.id ? (
                            <LoadingSpinner className="h-4 w-4" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Hadir
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitAbsensi(jadwal.id, 'IZIN')}
                          disabled={submittingId === jadwal.id}
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Izin
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitAbsensi(jadwal.id, 'SAKIT')}
                          disabled={submittingId === jadwal.id}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Sakit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}