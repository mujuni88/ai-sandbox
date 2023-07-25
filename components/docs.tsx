'use client';
import { generateMessages } from '@/lib/data';
import { useAutoResizeTextarea } from '@/lib/hooks/useAutoResizeTextarea';
import { useEnterSubmit } from '@/lib/hooks/useEnterSubmit';
import { cn } from '@/lib/utils';
import { useChat } from 'ai/react';
import { Metadata } from 'next';
import { ChatMessage } from './chat-message';
import { SubmitButton } from './submit-button';
import { Textarea } from './ui/textarea';

export const metadata: Metadata = {
  title: 'Langchain Agents',
  description: 'Agents for Langchain',
};

export function Docs() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/docs',
      initialMessages: [...generateMessages(20)],
    });

  const { textAreaRef, resetValue } = useAutoResizeTextarea(input);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <div className="grid items-start relative max-h-screen overflow-auto px-5">
      <div className="grid items-start gap-3 pb-[7rem]">
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
      </div>

      <div
        className={cn(
          'w-full fixed px-3 left-0 right-0 bottom-0 h-[6rem] grid place-items-center bg-black'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center bg-white-300 mx-auto w-full md:max-w-screen-md p-1 rounded-xl shadow-md  shadow-teal-300/50 bg-white"
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
            size={'sm'}
            disabled={!input || isLoading}
            loading={isLoading}
            className={cn(
              'col-start-2 col-end-3 row-start-1 row-end-2 mr-5 transition-colors disabled:opacity-40 bg-teal-800'
            )}
          />
        </form>
      </div>
    </div>
  );
}
