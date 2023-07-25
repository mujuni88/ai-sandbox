import { Chats } from '@/components/chats';
import { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid  grid-cols-[300px_1fr] bg-stone-500 h-full">
      <div className="grid h-full bg-stone-700 py-4 gap-4 overflow-y-auto">
        <Suspense fallback={<Loading />}>
          <Chats />
        </Suspense>
      </div>
      <div className="h-full overflow-y-auto scrollbar-thin  scrollbar-thumb-stone-700 scrollbar-thumb-rounded-lg">
        {children}
      </div>
    </main>
  );
}
