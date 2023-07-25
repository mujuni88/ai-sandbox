'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';

const NavLink = ({
  isActive,
  href,
  className,
  children,
}: {
  isActive?: boolean;
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const currentRoute = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors text-muted-foreground hover:text-foreground',
        {
          'text-foreground': isActive ?? currentRoute === href,
        },
        className
      )}
    >
      {children}
    </Link>
  );
};
export const PageHeader = () => {
  const currentRoute = usePathname();

  return (
    <header className="grid md:grid-cols-[300px_1fr_auto] px-3 py-3 bg-primary-foreground border items-center shadow-lg overflow-hidden">
      <Link
        href={'/'}
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-600"
      >
        Buza AI
      </Link>
      <nav className="flex items-center gap-6 font-medium">
        <NavLink
          href="/chats"
          isActive={currentRoute === '/' || /^\/chats/.test(currentRoute)}
        >
          Chats
        </NavLink>
        <NavLink href="/langchain">Langchain</NavLink>
        <NavLink href="/docs">Docs</NavLink>
      </nav>
      <ModeToggle />
    </header>
  );
};
