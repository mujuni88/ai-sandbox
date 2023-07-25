import { Chats } from '@/components/chats';
import { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid  grid-cols-[300px_1fr] bg-secondary h-full scrollbar-thin scrollbar-track-transparent  scrollbar-thumb-indigo-400 hover:scrollbar-thumb-indigo-500 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
      <Suspense fallback={<Loading />}>
        <Chats />
      </Suspense>
      {children}
    </main>
  );
}
