import BottomNav from '@/components/BottomNav';
import MasonryGrid from '@/components/MasonryGrid';
import { mockCards } from '@/data/mockCards';
import { LayoutGrid, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const myCards = mockCards.slice(2, 6);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">My Cards</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Cards you've created</p>
        </div>
        <Button size="sm" className="rounded-full" onClick={() => navigate('/designer/new')}>
          <Plus size={16} className="mr-1" /> New
        </Button>
      </div>

      <div className="px-4">
        <MasonryGrid cards={myCards} cardLinkPrefix="/designer/" />
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
