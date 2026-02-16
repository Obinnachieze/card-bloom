import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MasonryGrid from '@/components/MasonryGrid';
import BottomNav from '@/components/BottomNav';
import { mockCards } from '@/data/mockCards';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-8">
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
          onClick={() => navigate('/designer/new')}
          className="mt-5 rounded-full px-6"
          size="lg"
        >
          <Plus size={18} className="mr-2" />
          Create a Card
        </Button>
      </div>

      <div className="px-4">
        <MasonryGrid cards={mockCards} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
