import { buttonVariants } from '@/components/ui/button';
import { getAllChats } from '@/lib/redis';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { ChatItem } from './chat-item';

export const Chats = (async () => {
  const chats = await getAllChats();
  return (
    <div className="flex flex-col flex-1 h-full bg-primary-foreground py-4 gap-10 overflow-y-auto shadow-lg">
      <Link
        className={cn(buttonVariants(), 'mx-2')}
        href={`/chats/${nanoid(5)}`}
      >
        New Chat
      </Link>
      <ol className="min-h-0 flex flex-col gap-4 overflow-y-auto flex-1 scrollbar-thin">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </ol>
    </div>
  );
}) as unknown as React.FC;
