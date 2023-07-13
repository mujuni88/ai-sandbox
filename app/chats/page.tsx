import { buttonVariants } from '@/components/ui/button';
import { ChatSchema } from '@/lib/data';
import { getAllChats } from '@/lib/reddis';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import Link from 'next/link';

export default async function Chats() {
  const chats = await getAllChats();
  return (
    <>
      <Link
        className={cn(buttonVariants({}), 'mb-3')}
        href={`/chats/${nanoid(5)}`}
      >
        New Chat
      </Link>
      <h1 className="text-xl text-center">Chats</h1>
      {chats.map((chat) => (
        <Chat key={chat.id} chat={chat} />
      ))}
    </>
  );
}

const Chat = ({ chat }: { chat: ChatSchema }) => {
  return (
    <div className="grid grid-cols-3">
      <div>{chat.id}</div>
      <div>{chat.createdAt}</div>
      <div>{chat.messages.length}</div>
    </div>
  );
};
