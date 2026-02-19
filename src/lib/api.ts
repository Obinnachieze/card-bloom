
import { supabase } from '@/lib/supabase';
import { CardData } from '@/types';

export async function fetchCards(): Promise<CardData[]> {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data as any[]) || [];
}

export async function fetchCardById(id: string): Promise<CardData | null> {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        // Return null if not found to handle 404s gracefully
        return null;
    }

    return data as any;
}

export async function createCard(card: Omit<CardData, 'id' | 'likes' | 'created_at'>) {
    const { data, error } = await supabase
        .from('cards')
        .insert([card])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
