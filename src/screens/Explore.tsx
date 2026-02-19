"use client";

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MasonryGrid from '@/components/MasonryGrid';
import BottomNav from '@/components/BottomNav';
import CreateCardDrawer from '@/components/CreateCardDrawer';
import { mockCards } from '@/data/mockCards';

const Explore = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-8 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-accent" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">CardCraft</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground leading-tight">
          Send joy,<br />one card at a time ✨
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Create beautiful digital cards for any occasion
        </p>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="mt-5 rounded-full px-6"
          size="lg"
        >
          <Plus size={18} className="mr-2" />
          Create a Card
        </Button>
        <CreateCardDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      </div>

      <div className="px-4 sm:px-8 lg:px-12">
        <MasonryGrid cards={mockCards} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
