import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Shuffle, ArrowLeft } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { mockCards } from '@/data/mockCards';

interface CreateCardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCardDrawer = ({ open, onOpenChange }: CreateCardDrawerProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'choice' | 'remix'>('choice');

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) setView('choice');
  };

  const handleStartFresh = () => {
    handleOpenChange(false);
    navigate('/designer/new');
  };

  const handlePickRemix = (cardId: string) => {
    handleOpenChange(false);
    navigate(`/designer/remix-${cardId}`);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        {view === 'choice' ? (
          <>
            <DrawerHeader>
              <DrawerTitle>Create a Card</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-3 px-4 pb-6">
              <button
                onClick={handleStartFresh}
                className="flex items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted active:bg-muted"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <PenLine size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Start from scratch</p>
                  <p className="text-sm text-muted-foreground">Create a blank card</p>
                </div>
              </button>
              <button
                onClick={() => setView('remix')}
                className="flex items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted active:bg-muted"
              >
                <div className="rounded-full bg-accent/10 p-3">
                  <Shuffle size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Remix a card</p>
                  <p className="text-sm text-muted-foreground">Start from an existing design</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <DrawerHeader className="flex flex-row items-center gap-2">
              <button
                onClick={() => setView('choice')}
                className="rounded-full p-1.5 hover:bg-muted transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <DrawerTitle>Pick a card to remix</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handlePickRemix(card.id)}
                    className="group relative overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-md"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs font-medium text-white truncate">{card.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CreateCardDrawer;
