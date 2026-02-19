"use client";

import { Bookmark, Heart, MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardData, AspectRatio } from '@/data/mockCards';

const aspectRatioMap: Record<AspectRatio, string> = {
  portrait: '4/5',
  landscape: '3/2',
  square: '1/1',
  tall: '2/3',
};

interface CardTileProps {
  card: CardData;
  linkTo?: string;
}

const CardTile = ({ card, linkTo }: CardTileProps) => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const initials = card.creator.slice(0, 1).toUpperCase();

  return (
    <div className="group cursor-pointer">
      {/* Image container with hover overlay */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: aspectRatioMap[card.aspectRatio] }}
        onClick={() => router.push(linkTo || `/card/${card.id}`)}
      >
        <img
          src={typeof card.image === 'string' ? card.image : card.image.src}
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Mobile: always-visible bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors md:hidden ${saved
            ? 'bg-primary text-primary-foreground'
            : 'bg-black/40 text-white'
            }`}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Desktop: hover overlay */}
        <div className="hidden md:block absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
          {/* Save button - top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            className={`absolute top-2 right-2 px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${saved
              ? 'bg-black text-white'
              : 'bg-primary text-primary-foreground'
              }`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>

          {/* Bottom action buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
            >
              <Share2 size={14} className="text-gray-800" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
            >
              <MoreHorizontal size={14} className="text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Card info below image - Pinterest style */}
      <div className="px-1 pt-2 pb-1">
        <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {card.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {card.creator}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground ml-auto">
            <Heart size={12} />
            {card.likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardTile;
