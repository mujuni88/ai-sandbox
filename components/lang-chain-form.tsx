'use client';
import { SubmitButton } from '@/components/submit-button';
import { useAutoResizeTextarea } from '@/lib/hooks/useAutoResizeTextarea';
import { useEnterSubmit } from '@/lib/hooks/useEnterSubmit';
import { cn } from '@/lib/utils';
import { useChat } from 'ai/react';
import { Metadata } from 'next';
import { ChatMessage } from './chat-message';
import { Textarea } from './ui/textarea';

export const metadata: Metadata = {
  title: 'LangChain AI Chat Box',
  description: 'This chat is powered by Langchain framework',
};

export default function LangChainForm() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: '/api/langchain' });
  const { textAreaRef, resetValue } = useAutoResizeTextarea(input);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <div className="grid w-full grid-rows-[1fr_auto] items-start">
      <div className="grid items-start gap-3">
        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div
        className={cn(
          'w-full my-6 p-1 rounded-xl shadow-md bg-white shadow-purple-300/50'
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center"
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
              'col-start-2 col-end-3 row-start-1 row-end-2 mr-5 transition-colors disabled:opacity-40 bg-purple-800'
            )}
          />
        </form>
      </div>
    </div>
  );
}
