import { Chats } from '@/components/chats';
import { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid  grid-cols-[300px_1fr] bg-secondary h-full scrollbar-thin scrollbar-track-purple-300  scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
      <Suspense fallback={<Loading />}>
        <Chats />
      </Suspense>
      {children}
    </main>
  );
}
