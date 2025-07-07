'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Users, Calendar, Settings, Star, Bell, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/dashboard/profile', label: 'Profile', icon: Users },
    ];

    // Add role-specific menu items
    // if (user?.role === 'PENGAJAR' || user?.role === 'ADMIN') {
    //   baseItems.push(
    //     { href: '/dashboard/jadwal', label: 'Jadwal', icon: Calendar },
    //   );
    // }

    baseItems.push(
      { href: '/dashboard/jadwal', label: 'Jadwal', icon: Calendar },
      { href: '/dashboard/tes-harian', label: 'Tes Harian', icon: Star },
      { href: '/dashboard/notifikasi', label: 'Notifikasi', icon: Bell },
      { href: '/dashboard/materi', label: 'Modul Pembelajaran', icon: BookOpen },
    );

    if (user?.role === 'ADMIN') {
      baseItems.push(
        { href: '/dashboard/users', label: 'Users', icon: Users },
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="bg-green-500 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">MINDSIA</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                    isActive && 'bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};