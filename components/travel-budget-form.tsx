'use client';
import { SubmitButton } from '@/components/submit-button';
import { generateMessages } from '@/lib/data';
import { useAutoResizeTextarea } from '@/lib/hooks/useAutoResizeTextarea';
import { useEnterSubmit } from '@/lib/hooks/useEnterSubmit';
import { cn } from '@/lib/utils';
import { useChat } from 'ai/react';
import { Metadata } from 'next';
import { ChatMessage } from './chat-message';
import { Textarea } from './ui/textarea';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default function TravelBudgetForm() {
  const { formRef, onKeyDown } = useEnterSubmit();
  const { messages, handleSubmit, handleInputChange, input, isLoading, stop } =
    useChat({
      api: '/api/chat',
      initialMessages: [...generateMessages(10)],
    });
  const { textAreaRef, resetValue } = useAutoResizeTextarea(input);

  return (
    <div className="grid w-full grid-rows-[1fr_auto] bg-white/40 items-start">
      <div className="grid items-start gap-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      <div
        className={cn(
          'w-full my-6 p-1 rounded-xl shadow-md bg-white shadow-indigo-300/50'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLoading) {
              stop();
              return;
            }
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center"
          ref={formRef}
        >
          <Textarea
            onKeyDown={onKeyDown}
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
          />
          <SubmitButton
            size={'sm'}
            disabled={!input && !isLoading}
            loading={isLoading}
            className={cn(
              'col-start-2 col-end-3 row-start-1 row-end-2 mr-5 transition-colors disabled:opacity-40'
            )}
          />
        </form>
      </div>
    </div>
  );
}
