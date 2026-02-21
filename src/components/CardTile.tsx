"use client";

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardData, AspectRatio } from '@/types';

// Different height classes for masonry variety
const aspectClasses: Record<AspectRatio, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
  tall: 'aspect-[2/3]',
};

// Soft background colors for cards without images
const cardColors = [
  'bg-rose-50',
  'bg-sky-50',
  'bg-amber-50',
  'bg-emerald-50',
  'bg-violet-50',
  'bg-pink-50',
  'bg-cyan-50',
  'bg-orange-50',
  'bg-teal-50',
  'bg-indigo-50',
  'bg-lime-50',
  'bg-fuchsia-50',
];

interface CardTileProps {
  card: CardData;
  linkTo?: string;
}

const CardTile = ({ card, linkTo }: CardTileProps) => {
  const router = useRouter();

  const imageSrc = typeof card.image === 'string' ? card.image : card.image?.src;
  const hasImage = imageSrc && imageSrc.length > 0;

  // Deterministic color based on card id
  const colorIndex = card.id ? card.id.charCodeAt(0) % cardColors.length : 0;
  const bgColor = cardColors[colorIndex];

  return (
    <div className="group">
      {/* Card Face */}
      <div
        className={`relative ${aspectClasses[card.aspectRatio] || 'aspect-[3/4]'} w-full cursor-pointer rounded-[5px] overflow-hidden ${bgColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
        onClick={() => router.push(linkTo || `/card/${card.id}`)}
      >
        {hasImage ? (
          <img
            src={imageSrc}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Decorative card face when no image */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white/40 to-black/5">
            <p className="text-xl sm:text-2xl font-bold text-gray-800 text-center leading-tight line-clamp-3 px-2">
              {card.title}
            </p>
            <div className="w-8 h-1 bg-primary/20 rounded-full mt-4" />
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-4 font-semibold">
              {card.category}
            </p>
          </div>
        )}
      </div>

      {/* Card Metadata */}
      <div className="mt-3 px-1">
        <h3 className="text-[15px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
          {card.title}
        </h3>
        <p className="text-[13px] text-slate-400 mt-1 font-medium italic">
          by {card.creator}
        </p>
      </div>
    </div>
  );
};

export default CardTile;
