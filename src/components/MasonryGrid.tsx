import CardTile from './CardTile';
import { CardData } from '@/data/mockCards';

interface MasonryGridProps {
  cards: CardData[];
  cardLinkPrefix?: string;
}

const MasonryGrid = ({ cards, cardLinkPrefix }: MasonryGridProps) => {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 2xl:columns-5">
      {cards.map((card) => (
        <div key={card.id} className="mb-4 break-inside-avoid">
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
