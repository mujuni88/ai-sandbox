import { Skeleton } from './ui/skeleton';

export default function AiResponseLoader({ number = 10 }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {[...Array(number)].map((_, i) => (
        <Skeleton key={i} className="w-full h-[10px] bg-indigo-300/50" />
      ))}
    </div>
  );
}
