'use client';
import AiResponse from '@/components/ai-response';
import { SubmitButton } from '@/components/submit-button';
import { Metadata } from 'next';
import { Textarea } from './ui/textarea';
import { useChat } from '../hooks/useChat';
import { cn } from '@/lib/utils';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Bot, User } from 'lucide-react';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';

export const metadata: Metadata = {
  title: 'LangChain AI Chat Box',
  description: 'This chat is powered by Langchain framework',
};

export default function LangChainForm() {
  const { state, handleSubmit, stopStream } = useChat();
  const { isLoading, messages } = state;
  const { textAreaRef, handleChange, value, resetValue } =
    useAutoResizeTextarea();

  return (
    <div className="grid w-full grid-rows-[1fr_auto] items-start">
      <div className="grid items-start gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('grid gap-3 grid-cols-[auto_1fr]')}>
            <Avatar role={msg.role} className="self-end" />
            <div
              className={cn('relative p-5 rounded-2xl rounded-bl-none', {
                'bg-gray-200':
                  msg.role === ChatCompletionRequestMessageRoleEnum.Assistant,
                'bg-purple-100':
                  msg.role === ChatCompletionRequestMessageRoleEnum.User,
              })}
            >
              <SpeechBubble
                className={cn({
                  'bg-gray-200':
                    msg.role === ChatCompletionRequestMessageRoleEnum.Assistant,
                  'bg-purple-100':
                    msg.role === ChatCompletionRequestMessageRoleEnum.User,
                })}
              />
              <AiResponse text={msg.content} />
            </div>
          </div>
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
            if (isLoading) {
              stopStream();
              return;
            }
            handleSubmit(e);
            resetValue();
            textAreaRef.current?.focus();
          }}
          className="grid gap-3 grid-cols-[1fr_auto] place-items-center"
        >
          <Textarea
            ref={textAreaRef}
            name="content"
            id="content"
            placeholder="Send a message"
            value={value}
            onChange={handleChange}
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
            disabled={!value && !isLoading}
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

const Avatar = ({
  className,
  role,
}: {
  role: ChatCompletionRequestMessageRoleEnum;
  className?: string;
}) => {
  const user = role === ChatCompletionRequestMessageRoleEnum.User;
  return (
    <span
      className={cn(
        'text-center font-bold text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0',
        {
          'bg-gray-500':
            role === ChatCompletionRequestMessageRoleEnum.Assistant,
          'bg-purple-500': role === ChatCompletionRequestMessageRoleEnum.User,
        },
        className
      )}
    >
      {user ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
    </span>
  );
};

const SpeechBubble = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-3 h-3 absolute bottom-0 -left-[0.7rem] clip-path-polygon-[100%_0,_0%_100%,_100%_100%]',
      className
    )}
  />
);