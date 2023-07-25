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
      <Suspense fallback={<Loading />}>
        <Chats />
      </Suspense>
      {children}
    </main>
  );
}
