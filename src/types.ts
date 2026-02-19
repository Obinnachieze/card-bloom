
import { StaticImageData } from 'next/image';

export type AspectRatio = 'portrait' | 'landscape' | 'square' | 'tall';

export interface CardData {
    id: string;
    title: string;
    creator: string;
    image: string | StaticImageData;
    likes: number;
    category: string;
    aspectRatio: AspectRatio;
}
