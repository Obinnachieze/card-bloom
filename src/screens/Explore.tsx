"use client";

import { useState, useEffect, useCallback } from 'react';
import MasonryGrid from '@/components/MasonryGrid';
import SkeletonGrid from '@/components/SkeletonGrid';
import BottomNav from '@/components/BottomNav';
import { fetchCardsPaginated } from '@/lib/api';
import { CardData } from '@/types';

const Explore = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async (pageNum: number, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const result = await fetchCardsPaginated(pageNum);

      if (append) {
        setCards((prev) => [...prev, ...result.cards]);
      } else {
        setCards(result.cards);
      }

      setHasMore(result.hasMore);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadCards(0);
  }, [loadCards]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadCards(page + 1, true);
    }
  };

  return (
    <div className="bg-[#eef3f9] pb-24">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
          Explore Cards
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Discover beautiful cards created by the community.
        </p>
      </div>

      {/* Card grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-12">
        {isLoading ? (
          <SkeletonGrid count={24} />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => loadCards(0)}
              className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No cards yet. Be the first to create one!</p>
          </div>
        ) : (
          <>
            <MasonryGrid cards={cards} />

            {isLoadingMore && (
              <div className="mt-8">
                <SkeletonGrid count={12} />
              </div>
            )}

            {hasMore && !isLoadingMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-150 active:scale-[0.97]"
                >
                  Load More
                </button>
              </div>
            )}

            {!hasMore && cards.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-10">
                You&apos;ve seen all the cards
              </p>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
