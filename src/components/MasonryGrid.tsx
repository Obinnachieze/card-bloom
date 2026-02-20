import CardTile from './CardTile';
import { CardData } from '@/types';

interface MasonryGridProps {
  cards: CardData[];
  cardLinkPrefix?: string;
}

const MasonryGrid = ({ cards, cardLinkPrefix }: MasonryGridProps) => {
  return (
    <div className="columns-2 gap-3 sm:columns-3 sm:gap-3 md:columns-4 lg:columns-5 xl:columns-6">
      {cards.map((card) => (
        <div key={card.id} className="mb-3 break-inside-avoid">
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
