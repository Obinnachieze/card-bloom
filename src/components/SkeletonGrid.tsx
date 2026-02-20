"use client";

const HEIGHTS = ['h-40', 'h-52', 'h-44', 'h-60', 'h-48', 'h-56', 'h-36', 'h-64', 'h-44', 'h-52', 'h-48', 'h-56'];
const COLORS = ['bg-rose-50', 'bg-sky-50', 'bg-amber-50', 'bg-emerald-50', 'bg-violet-50', 'bg-pink-50', 'bg-cyan-50', 'bg-orange-50', 'bg-teal-50', 'bg-indigo-50', 'bg-lime-50', 'bg-fuchsia-50'];

const SkeletonGrid = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-3 md:columns-4 lg:columns-5 xl:columns-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="mb-3 break-inside-avoid">
                    {/* Card skeleton */}
                    <div className={`${HEIGHTS[i % HEIGHTS.length]} w-full rounded-lg ${COLORS[i % COLORS.length]} animate-pulse shadow-sm`} />
                    {/* Text skeletons */}
                    <div className="mt-2 space-y-1 px-0.5">
                        <div className="h-3 bg-gray-200/50 rounded w-4/5 animate-pulse" />
                        <div className="h-2.5 bg-gray-200/50 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonGrid;
