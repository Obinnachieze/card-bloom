import CardTile from './CardTile';
import { CardData } from '@/data/mockCards';

interface MasonryGridProps {
  cards: CardData[];
  cardLinkPrefix?: string;
}

const MasonryGrid = ({ cards, cardLinkPrefix }: MasonryGridProps) => {
  return (
    <div className="mx-auto max-w-7xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5">
      {cards.map((card) => (
        <div key={card.id} className="mb-3 sm:mb-4 break-inside-avoid">
          <CardTile
            card={card}
            linkTo={cardLinkPrefix ? `${cardLinkPrefix}${card.id}` : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
