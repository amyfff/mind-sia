'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, BookOpen, Users, CheckCircle, XCircle, Clock, User, Star, TrendingUp, Activity } from 'lucide-react';
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
      case 'PESERTA':
        return 'You have completed 60% of your goal this week! Start a new goal and improve your result.';
      case 'PENGAJAR':
        return 'Welcome back! You have 5 new students this week. Keep up the great work!';
      case 'ADMIN':
        return 'System overview: All services running smoothly. 45 active users today.';
      default:
        return 'Welcome to your dashboard';
    }
  };

  const getStatsData = () => {
    if (user?.role === 'ADMIN') {
      return [
        { label: 'Students', value: '359', color: 'text-green-500' },
        { label: 'Parent', value: '12', color: 'text-pink-500' },
        { label: 'Teachers', value: '04', color: 'text-orange-500' }
      ];
    } else if (user?.role === 'PENGAJAR') {
      return [
        { label: 'Students', value: '24', color: 'text-green-500' },
        { label: 'Courses', value: '8', color: 'text-blue-500' },
        { label: 'Completed', value: '15', color: 'text-purple-500' }
      ];
    } else {
      return [
        { label: 'Courses', value: '12', color: 'text-green-500' },
        { label: 'Completed', value: '8', color: 'text-blue-500' },
        { label: 'Progress', value: '75%', color: 'text-orange-500' }
      ];
    }
  };

  const recentActivities = [
    { name: 'Francis Tran', action: 'Health is not good.', time: '05 Minutes Ago', avatar: 'FT' },
    { name: 'Elliana Palacios', action: 'Health is not good.', time: '23 Minutes Ago', avatar: 'EP' },
    { name: 'Katherine Webster', action: 'Going on trip with my family.', time: '10 Minutes Ago', avatar: 'KW' },
    { name: 'Avalon Carey', action: 'Going on trip with my family.', time: '10 Minutes Ago', avatar: 'AC' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <div className="relative bg-linear-to-r from-green-400 to-green-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">WELCOME BACK!</h1>
          <p className="text-green-100 mb-6 text-lg">
            {getWelcomeMessage()}
          </p>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg">
            Learn More
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating decorative shapes */}
        <div className="absolute top-4 right-32 w-4 h-4 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-12 right-24 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute bottom-8 right-40 w-6 h-6 bg-purple-400 rounded-full"></div>
        <div className="absolute top-8 right-16 w-2 h-2 bg-orange-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {getStatsData().map((stat, index) => (
              <Card key={index} className="text-center p-4">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Jadwal Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Jadwal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {jadwalList.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No schedules available</p>
                ) : (
                  <div className="space-y-3">
                    {jadwalList.slice(0, 2).map((jadwal) => (
                      <div key={jadwal.id} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">{jadwal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{jadwal.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{jadwal.tanggal}</span>
                          {user?.role === 'PESERTA' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitAbsensi(jadwal.id, 'HADIR')}
                                disabled={submittingId === jadwal.id}
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
                              >
                                Hadir
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

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Tes Harian</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Mathematics Quiz</h4>
                    <p className="text-sm text-gray-600 mt-1">Basic algebra and geometry</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Due: Today</span>
                      <Badge className="bg-blue-500 text-white text-xs">Active</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Programming Test</h4>
                    <p className="text-sm text-gray-600 mt-1">JavaScript fundamentals</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Due: Tomorrow</span>
                      <Badge variant="outline" className="text-xs">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Modul Pembelajaran</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">React Fundamentals</h4>
                    <p className="text-sm text-gray-600 mt-1">Learn the basics of React</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Progress: 75%</span>
                      <Badge className="bg-green-500 text-white text-xs">In Progress</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Advanced CSS</h4>
                    <p className="text-sm text-gray-600 mt-1">Master modern CSS techniques</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Progress: 45%</span>
                      <Badge variant="outline" className="text-xs">Available</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Tes Harian</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Weekly Assessment</h4>
                    <p className="text-sm text-gray-600 mt-1">Complete your weekly test</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Due: 2 days</span>
                      <Badge className="bg-orange-500 text-white text-xs">Pending</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Monthly Review</h4>
                    <p className="text-sm text-gray-600 mt-1">Comprehensive monthly test</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Due: Next week</span>
                      <Badge variant="outline" className="text-xs">Scheduled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Students Added last 10 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-500 text-white text-sm">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{activity.name}</p>
                      <p className="text-gray-600 text-xs mt-1">{activity.action}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                View More
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Materials
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Check Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}