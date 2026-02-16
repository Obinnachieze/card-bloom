import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardData } from '@/data/mockCards';

interface CardTileProps {
  card: CardData;
  linkTo?: string;
}

const CardTile = ({ card, linkTo }: CardTileProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(linkTo || `/card/${card.id}`)}
      className="w-full text-left rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
    >
      <img src={card.image} alt={card.title} className="w-full" loading="lazy" />
      <div className="p-2.5">
        <p className="text-sm font-bold text-card-foreground truncate">{card.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{card.creator}</span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Heart size={12} />
            {card.likes}
          </span>
        </div>
      </div>
    </button>
  );
};

export default CardTile;
