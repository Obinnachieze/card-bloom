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
  const [liked, setLiked] = useState(false);

  const imageSrc = typeof card.image === 'string' ? card.image : card.image?.src;
  const hasImage = imageSrc && imageSrc.length > 0;

  // Deterministic color based on card id
  const colorIndex = card.id ? card.id.charCodeAt(0) % cardColors.length : 0;
  const bgColor = cardColors[colorIndex];

  return (
    <div className="group">
      {/* Card */}
      <div
        className={`relative ${aspectClasses[card.aspectRatio] || 'aspect-[3/4]'} w-full cursor-pointer rounded-lg overflow-hidden ${bgColor} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
        onClick={() => router.push(linkTo || `/card/${card.id}`)}
      >
        {hasImage ? (
          <img
            src={imageSrc}
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          /* Decorative card face when no image */
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <p className="text-base sm:text-lg font-semibold text-gray-700 text-center leading-snug line-clamp-3">
              {card.title}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {card.category}
            </p>
          </div>
        )}

        {/* Heart icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
            ${liked
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-white/70 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
            }`}
        >
          <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card info */}
      <div className="mt-2 px-0.5">
        <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
          {card.title}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          by {card.creator}
        </p>
      </div>
    </div>
  );
};

export default CardTile;
