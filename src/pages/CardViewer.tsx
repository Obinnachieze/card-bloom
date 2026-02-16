import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shuffle, Share2 } from 'lucide-react';
import { mockCards } from '@/data/mockCards';
import { useState } from 'react';

const CardViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = mockCards.find((c) => c.id === id);
  const [liked, setLiked] = useState(false);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Card not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-foreground p-1">
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-medium text-muted-foreground">by {card.creator}</span>
        <button className="text-muted-foreground p-1">
          <Share2 size={20} />
        </button>
      </div>

      {/* Card display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
          <img src={card.image} alt={card.title} className="w-full" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-10 px-4 py-6 safe-area-bottom">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            liked ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          <Heart size={26} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-xs font-medium">{card.likes + (liked ? 1 : 0)}</span>
        </button>
        <button
          onClick={() => navigate(`/designer/remix-${card.id}`)}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Shuffle size={26} />
          <span className="text-xs font-medium">Remix</span>
        </button>
      </div>
    </div>
  );
};

export default CardViewer;
