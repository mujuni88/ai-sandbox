import { ChatDetails } from '@/components/chat-details';
import { nanoid } from 'nanoid';

export default async function NewChat() {
  return <ChatDetails params={{ id: nanoid(10) }} />;
}
