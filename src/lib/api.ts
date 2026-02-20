
import { supabase } from '@/lib/supabase';
import { CardData } from '@/types';

const PAGE_SIZE = 24;

export async function fetchCards(): Promise<CardData[]> {
    const { data, error } = await supabase
        .from('cards')
        .select('*, aspectRatio:aspect_ratio')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data as any[]) || [];
}

export async function fetchCardsPaginated(
    page: number = 0,
    pageSize: number = PAGE_SIZE
): Promise<{ cards: CardData[]; hasMore: boolean }> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
        .from('cards')
        .select('*, aspectRatio:aspect_ratio', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    const cards = (data as any[]) || [];
    const totalCount = count ?? 0;
    const hasMore = from + cards.length < totalCount;

    return { cards, hasMore };
}

export async function fetchCardById(id: string): Promise<CardData | null> {
    const { data, error } = await supabase
        .from('cards')
        .select('*, aspectRatio:aspect_ratio')
        .eq('id', id)
        .single();

    if (error) {
        // Return null if not found to handle 404s gracefully
        return null;
    }

    return data as any;
}

export async function createCard(card: Omit<CardData, 'id' | 'likes' | 'created_at'>) {
    const dbCard = {
        ...card,
        aspect_ratio: card.aspectRatio,
    };
    // Remove the camelCase version if present to avoid DB errors (though extra fields are usually ignored if strict is off, best to be safe)
    delete (dbCard as any).aspectRatio;

    const { data, error } = await supabase
        .from('cards')
        .insert([dbCard])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
