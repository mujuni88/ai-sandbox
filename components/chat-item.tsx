'use client';

import { buttonVariants } from '@/components/ui/button';
import { ChatSchema } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ChatItem = ({ chat }: { chat: ChatSchema }) => {
  const path = usePathname();
  const href = `/chats/${chat.id}`;
  const isActive = path === href;

  return (
    <li>
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'grid grid-cols-[auto_1fr] mx-2 hover:bg-indigo-400 hover:text-secondary',
          {
            ['bg-indigo-400 text-secondary']: isActive,
          }
        )}
        href={`/chats/${chat.id}`}
      >
        <MessageSquare className="mr-2" /> {chat.title ?? chat.id}
      </Link>
    </li>
  );
};
