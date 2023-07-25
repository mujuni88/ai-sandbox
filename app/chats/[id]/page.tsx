'use client';
import { ChatDetails } from '@/components/chat-details';

interface ChatProps {
  params: {
    id: string;
  };
}

export default async function Details({ params }: ChatProps) {
  return <ChatDetails params={params} />;
}
