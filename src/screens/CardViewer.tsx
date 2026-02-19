"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Shuffle, Share2 } from 'lucide-react';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { fetchCardById } from '@/lib/api';

const CardViewer = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const { data: card, isLoading } = useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

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
        <button onClick={() => router.back()} className="text-foreground p-1">
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
          <img src={typeof card.image === 'string' ? card.image : card.image.src} alt={card.title} className="w-full" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-10 px-4 py-6 safe-area-bottom">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex flex-col items-center gap-1 transition-colors ${liked ? 'text-destructive' : 'text-muted-foreground'
            }`}
        >
          <Heart size={26} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-xs font-medium">{card.likes + (liked ? 1 : 0)}</span>
        </button>
        <button
          onClick={() => router.push(`/designer/remix-${card.id}`)}
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
