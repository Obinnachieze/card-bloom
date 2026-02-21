import cardBirthday from '@/assets/card-birthday.jpg';
import cardThankyou from '@/assets/card-thankyou.jpg';
import cardCongrats from '@/assets/card-congrats.jpg';
import cardLove from '@/assets/card-love.jpg';

import { StaticImageData } from 'next/image';

import { CardData, AspectRatio } from '@/types';

export const mockCards: CardData[] = [
  { id: '1', title: 'Happy Birthday!', creator: 'Alice', image: cardBirthday, likes: 124, category: 'Birthday', aspectRatio: 'portrait' },
  { id: '2', title: 'Thank You So Much', creator: 'Bob', image: cardThankyou, likes: 85, category: 'Thank You', aspectRatio: 'square' },
  { id: '3', title: 'Congratulations!', creator: 'Carol', image: cardCongrats, likes: 210, category: 'Congrats', aspectRatio: 'portrait' },
  { id: '4', title: 'With Love', creator: 'Dave', image: cardLove, likes: 156, category: 'Love', aspectRatio: 'tall' },
  { id: '5', title: 'Birthday Wishes', creator: 'Elena', image: cardBirthday, likes: 45, category: 'Birthday', aspectRatio: 'tall' },
  { id: '6', title: 'Heartfelt Thanks', creator: 'Frank', image: cardThankyou, likes: 62, category: 'Thank You', aspectRatio: 'portrait' },
  { id: '7', title: 'You Did It!', creator: 'Grace', image: cardCongrats, likes: 98, category: 'Congrats', aspectRatio: 'portrait' },
  { id: '8', title: 'Forever Yours', creator: 'Henry', image: cardLove, likes: 134, category: 'Love', aspectRatio: 'tall' },
  { id: '9', title: 'Hooray!', creator: 'Ivy', image: cardCongrats, likes: 77, category: 'Congrats', aspectRatio: 'landscape' },
  { id: '10', title: 'Big Hugs', creator: 'Jack', image: cardLove, likes: 121, category: 'Love', aspectRatio: 'tall' },
  { id: '11', title: 'Party Time', creator: 'Kate', image: cardBirthday, likes: 88, category: 'Birthday', aspectRatio: 'tall' },
  { id: '12', title: 'Many Thanks', creator: 'Leo', image: cardThankyou, likes: 35, category: 'Thank You', aspectRatio: 'landscape' },
];
