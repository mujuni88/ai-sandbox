import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-3 container">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="w-full bg-gray-300 h-10 py-2 px-4" />
      ))}
    </div>
  );
}
