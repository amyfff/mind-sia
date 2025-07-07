'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'PESERTA' && user.role !== 'PENGAJAR' && user.role !== 'ADMIN') {
      router.push('/unauthorized');
    } else if (isAuthenticated && user && user.role === 'PESERTA') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}