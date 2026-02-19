"use client";

import MasonryGrid from '@/components/MasonryGrid';
import BottomNav from '@/components/BottomNav';
import { useQuery } from '@tanstack/react-query';
import { fetchCards } from '@/lib/api';

const Explore = () => {
  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 sm:px-8 lg:px-12 py-12">
        {isLoading ? (
          <div className="text-center py-10">Loading cards...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading cards</div>
        ) : (
          <MasonryGrid cards={cards || []} />
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
