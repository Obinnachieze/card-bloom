"use client";

import { useState } from 'react';
import { Compass, Mail, LayoutGrid, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import CreateCardDrawer from '@/components/CreateCardDrawer';

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = [
    { icon: Compass, label: 'Explore', path: '/' },
    { icon: Mail, label: 'Inbox', path: '/inbox' },
    { icon: LayoutGrid, label: 'My Cards', path: '/dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5"
        >
          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-md">
            <Plus size={20} />
          </div>
        </button>
      </div>
      <CreateCardDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </nav>
  );
};

export default BottomNav;
