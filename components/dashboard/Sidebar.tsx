'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/dashboard/materi', label: 'Materi', icon: BookOpen },
    ];

    if (user?.role === 'pengajar' || user?.role === 'admin') {
      baseItems.push(
        { href: '/dashboard/jadwal', label: 'Jadwal', icon: Calendar },
      );
    }

    if (user?.role === 'admin') {
      baseItems.push(
        { href: '/dashboard/users', label: 'Users', icon: Users },
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-green-500 hover:bg-green-600 text-white'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
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