import BottomNav from '@/components/BottomNav';
import MasonryGrid from '@/components/MasonryGrid';
import { mockCards } from '@/data/mockCards';
import { Mail } from 'lucide-react';

const Inbox = () => {
  const receivedCards = mockCards.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <Mail size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Cards you've received</p>
      </div>

      <div className="px-4 sm:px-8 lg:px-12">
        {receivedCards.length > 0 ? (
          <MasonryGrid cards={receivedCards} />
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Mail size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No cards yet</p>
            <p className="text-sm mt-1">Cards sent to you will appear here</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Inbox;
