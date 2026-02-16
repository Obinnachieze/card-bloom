import cardBirthday from '@/assets/card-birthday.jpg';
import cardThankyou from '@/assets/card-thankyou.jpg';
import cardCongrats from '@/assets/card-congrats.jpg';
import cardLove from '@/assets/card-love.jpg';

export type AspectRatio = 'portrait' | 'landscape' | 'square' | 'tall';

export interface CardData {
  id: string;
  title: string;
  creator: string;
  image: string;
  likes: number;
  category: string;
  aspectRatio: AspectRatio;
}

export const mockCards: CardData[] = [
  { id: '1', title: 'Happy Birthday!', creator: 'Alice', image: cardBirthday, likes: 42, category: 'Birthday', aspectRatio: 'portrait' },
  { id: '2', title: 'Thank You So Much', creator: 'Bob', image: cardThankyou, likes: 28, category: 'Thank You', aspectRatio: 'square' },
  { id: '3', title: 'Congratulations!', creator: 'Carol', image: cardCongrats, likes: 56, category: 'Congrats', aspectRatio: 'portrait' },
  { id: '4', title: 'With Love', creator: 'Dave', image: cardLove, likes: 35, category: 'Love', aspectRatio: 'tall' },
  { id: '5', title: 'Birthday Wishes', creator: 'Eve', image: cardBirthday, likes: 19, category: 'Birthday', aspectRatio: 'tall' },
  { id: '6', title: 'Grateful Heart', creator: 'Frank', image: cardThankyou, likes: 44, category: 'Thank You', aspectRatio: 'portrait' },
  { id: '7', title: 'You Did It!', creator: 'Grace', image: cardCongrats, likes: 31, category: 'Congrats', aspectRatio: 'portrait' },
  { id: '8', title: 'Forever Yours', creator: 'Hank', image: cardLove, likes: 67, category: 'Love', aspectRatio: 'tall' },
  { id: '9', title: 'Business Launch', creator: 'Irene', image: cardCongrats, likes: 23, category: 'Business', aspectRatio: 'landscape' },
  { id: '10', title: 'You\'re Invited', creator: 'Jack', image: cardLove, likes: 89, category: 'Wedding', aspectRatio: 'tall' },
  { id: '11', title: 'Save the Date', creator: 'Karen', image: cardBirthday, likes: 54, category: 'Wedding', aspectRatio: 'tall' },
  { id: '12', title: 'Company Rebrand', creator: 'Leo', image: cardThankyou, likes: 17, category: 'Business', aspectRatio: 'landscape' },
  { id: '13', title: 'Milestone Birthday', creator: 'Mona', image: cardBirthday, likes: 73, category: 'Birthday', aspectRatio: 'portrait' },
  { id: '14', title: 'Thanks a Million', creator: 'Nate', image: cardThankyou, likes: 36, category: 'Thank You', aspectRatio: 'square' },
  { id: '15', title: 'Grand Opening', creator: 'Olivia', image: cardCongrats, likes: 41, category: 'Business', aspectRatio: 'landscape' },
  { id: '16', title: 'Wedding Bells', creator: 'Pete', image: cardLove, likes: 95, category: 'Wedding', aspectRatio: 'tall' },
];
