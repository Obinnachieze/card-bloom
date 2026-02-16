import cardBirthday from '@/assets/card-birthday.jpg';
import cardThankyou from '@/assets/card-thankyou.jpg';
import cardCongrats from '@/assets/card-congrats.jpg';
import cardLove from '@/assets/card-love.jpg';

export interface CardData {
  id: string;
  title: string;
  creator: string;
  image: string;
  likes: number;
  category: string;
}

export const mockCards: CardData[] = [
  { id: '1', title: 'Happy Birthday!', creator: 'Alice', image: cardBirthday, likes: 42, category: 'Birthday' },
  { id: '2', title: 'Thank You So Much', creator: 'Bob', image: cardThankyou, likes: 28, category: 'Thank You' },
  { id: '3', title: 'Congratulations!', creator: 'Carol', image: cardCongrats, likes: 56, category: 'Congrats' },
  { id: '4', title: 'With Love', creator: 'Dave', image: cardLove, likes: 35, category: 'Love' },
  { id: '5', title: 'Birthday Wishes', creator: 'Eve', image: cardBirthday, likes: 19, category: 'Birthday' },
  { id: '6', title: 'Grateful Heart', creator: 'Frank', image: cardThankyou, likes: 44, category: 'Thank You' },
  { id: '7', title: 'You Did It!', creator: 'Grace', image: cardCongrats, likes: 31, category: 'Congrats' },
  { id: '8', title: 'Forever Yours', creator: 'Hank', image: cardLove, likes: 67, category: 'Love' },
];
