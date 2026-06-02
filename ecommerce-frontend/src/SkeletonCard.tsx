const SkeletonCard = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 animate-pulse">
    <div className="aspect-square bg-gray-700" />
    <div className="flex flex-col p-4 gap-3">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/3" />
      <div className="h-3 bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-700 rounded w-5/6" />
      <div className="h-10 bg-gray-700 rounded-xl mt-2" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const OrderSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-4 bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-700 rounded w-24" />
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-700 rounded w-4/5" />
        </div>
        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between">
          <div className="h-4 bg-gray-700 rounded w-20" />
          <div className="h-6 bg-gray-700 rounded w-24" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonCard;
