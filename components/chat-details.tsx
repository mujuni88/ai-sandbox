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
      },
    });

  messageRef.current = messages;

  const { textAreaRef, resetValue } = useAutoResizeTextarea(input);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <div className="grid w-full items-start relative overflow-y-auto mb-36 pb-4 mt-4 scrollbar-thin">
      <div className="grid items-start gap-3 pt-4 container">
        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div
        className={cn(
          'fixed bottom-0 right-0 h-32 grid place-items-center px-2 w-full md:w-[calc(100vw_-_300px)] bg-secondary bg-gradient-to-t from-secondary to-primary/5'
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
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center container rounded-sm p-0"
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
              'border-none max-h-52 resize-none overflow-auto p-3 scroll col-start-1 col-end-3 row-start-1 row-end-2 pr-16 text-base bg-card text-card-foreground shadow-lg'
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
