import { buttonVariants } from '@/components/ui/button';
import { ChatSchema } from '@/lib/data';
import { getAllChats } from '@/lib/redis';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';

export const Chats = (async () => {
  const chats = await getAllChats();
  return (
    <>
      <Link
        className={cn(buttonVariants(), 'mx-2')}
        href={`/chats/${nanoid(5)}`}
      >
        New Chat
      </Link>
      <ol className="flex flex-col gap-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-track-rounded-md  scrollbar-thumb-stone-300 scrollbar-thumb-rounded-lg">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </ol>
    </>
  );
}) as unknown as React.FC;

const ChatItem = ({ chat }: { chat: ChatSchema }) => {
  return (
    <li>
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'grid grid-cols-[auto_1fr]'
        )}
        href={`/chats/${chat.id}`}
      >
        <MessageSquare className="mr-2" /> {chat.title}
      </Link>
    </li>
  );
};
