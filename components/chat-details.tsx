'use client';
import { ChatMessage } from '@/components/chat-message';
import { SubmitButton } from '@/components/submit-button';
import { Textarea } from '@/components/ui/textarea';
import { ChatSchema, chatSchema } from '@/lib/data';
import { useAutoResizeTextarea } from '@/lib/hooks/useAutoResizeTextarea';
import { useEnterSubmit } from '@/lib/hooks/useEnterSubmit';
import { cn } from '@/lib/utils';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import useSWR from 'swr';

interface ChatProps {
  params: {
    id: string;
  };
}

const saveChat = async (id: string, messages: Message[]) => {
  const body = {
    id,
    messages: messages.map((message) => ({
      ...message,
      createdAt: message?.createdAt?.toISOString(),
    })),
  } satisfies ChatSchema;

  const response = await fetch('/api/chatSave', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.json();
};

const fetchChat = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return chatSchema.parse(data);
};

export const ChatDetails = ({ params }: ChatProps) => {
  const messageRef = useRef<Message[] | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data } = useSWR(
    `/api/langchain?` + new URLSearchParams({ id: params.id }),
    fetchChat
  );

  const initialMessages = (data?.messages ?? []).map((message) => ({
    ...message,
    id: message.id ?? nanoid(),
    createdAt: message.createdAt ? new Date(message.createdAt) : undefined,
  })) satisfies Message[];

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
      api: '/api/langchain',
      id: params.id,
      sendExtraMessageFields: true,
      onFinish: () => {
        saveChat(params.id, messageRef.current ?? []);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      },
      onResponse: () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      },
    });

  messageRef.current = messages;

  const { textAreaRef, resetValue } = useAutoResizeTextarea(input);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <div className="h-full grid overflow-y-auto relative">
      <div className="mt-4 overflow-y-auto scrollbar-thin">
        <div className="container flex flex-col gap-3 flex-1">
          {messages?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <div ref={scrollRef} className="h-36 bg-secondary"></div>
      </div>

      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 grid place-items-center px-2 bg-transparent bg-gradient-to-b from-transparent to-secondary py-10 '
        )}
      >
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center container rounded-sm p-0 shadow-2xl shadow-black"
        >
          <Textarea
            ref={textAreaRef}
            name="content"
            id="content"
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
            rows={1}
            className={cn(
              'border-none max-h-52 resize-none overflow-auto p-3 scroll col-start-1 col-end-3 row-start-1 row-end-2 pr-16 text-base bg-card text-card-foreground shadow-lg ring-1 ring-indigo-400 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:ring-2'
            )}
            onKeyDown={onKeyDown}
          />
          <SubmitButton
            variant={'secondary'}
            size={'sm'}
            disabled={!input || isLoading}
            loading={isLoading}
            className={cn(
              'col-start-2 col-end-3 row-start-1 row-end-2 mr-5 transition-colors'
            )}
          />
        </form>
      </div>
    </div>
  );
};
