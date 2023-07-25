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

export const ChatDetails = (async ({ params }: ChatProps) => {
  const messageRef = useRef<Message[] | null>(null);
  const { data } = useSWR(
    `/api/langchain?` + new URLSearchParams({ id: params.id }),
    fetchChat,
    {
      suspense: true,
      fallbackData: { id: 'error', messages: [] },
    }
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
    <div className="grid w-full items-start relative overflow-y-auto scrollbar-thin  scrollbar-thumb-stone-700 scrollbar-thumb-rounded-lg">
      <div className="grid items-start gap-3 pt-4 pb-36 container">
        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div
        className={cn(
          'fixed bottom-0 right-0 h-32 grid place-items-center px-2 w-full md:w-[calc(100vw_-_300px)] bg-stone-500 bg-gradient-to-t from-stone-500 to-stone-400'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center container bg-white rounded-sm p-0"
          ref={formRef}
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
              'border-none max-h-52 resize-none overflow-auto p-3 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 scroll col-start-1 col-end-3 row-start-1 row-end-2 pr-16 text-base'
            )}
            style={{
              scrollbarColor: '#a0aec0 #edf2f7',
            }}
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
}) as unknown as React.FC<ChatProps>;
