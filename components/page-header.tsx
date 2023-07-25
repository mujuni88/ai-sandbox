'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const PageHeader = () => {
  const currentRoute = usePathname();

  return (
    <header className="grid md:grid-cols-[300px_1fr] px-3 py-5 bg-stone-900 border-b-stone-400 border items-center">
      <Link
        href={'/'}
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-600"
      >
        Buza AI
      </Link>
      <nav className="flex items-center gap-6 font-medium">
        <Link
          href="/chats"
          className={cn(
            'transition-colors hover:text-foreground/80 text-foreground/60',
            {
              'text-foreground':
                currentRoute === '/' || /^\/chats/.test(currentRoute),
            }
          )}
        >
          Chats
        </Link>
        <Link
          href="/langchain"
          className={cn(
            'transition-colors hover:text-foreground/80 text-foreground/60',
            {
              'text-foreground': currentRoute === '/langchain',
            }
          )}
        >
          Langchain
        </Link>
        <Link
          href="/docs"
          className={cn(
            'transition-colors hover:text-foreground/80 text-foreground/60',
            {
              'text-foreground': currentRoute === '/docs',
            }
          )}
        >
          Docs
        </Link>
      </nav>
    </header>
  );
};
