'use client';
import AiResponse from '@/components/ai-response';
import { MessageSchema } from '@/lib/data';
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';
import { Message } from 'ai';
import { Check, Copy } from 'lucide-react';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ReactElement } from 'react';
import { Avatar } from './avatar';
import { Button } from './ui/button';

export function ChatMessage({
  message,
  className,
  avatar,
}: {
  message: MessageSchema | Message;
  className?: string;
  avatar?: ReactElement;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 });

  return (
    <div
      key={message.id}
      className={cn('grid gap-3 grid-cols-[auto_1fr] group relative')}
    >
      {avatar ? avatar : <Avatar role={message.role} className="self-end" />}
      <div
        className={cn(
          'relative p-5 pr-4 rounded-2xl rounded-bl-none grid grid-cols-[1fr_auto] items-center',
          {
            'bg-gray-200':
              message.role === ChatCompletionRequestMessageRoleEnum.Assistant,
            'bg-indigo-100':
              message.role === ChatCompletionRequestMessageRoleEnum.User,
          },
          className
        )}
      >
        <SpeechBubble />
        <AiResponse text={message.content} />

        <Button
          className="my-auto invisible group-hover:visible"
          size={'icon'}
          variant={'outline'}
          onClick={() => copyToClipboard(message.content)}
        >
          {isCopied ? (
            <Check className="text-zinc h-4 w-4" />
          ) : (
            <Copy className="text-zinc h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

const SpeechBubble = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-3 h-3 absolute bottom-0 -left-[0.7rem] clip-path-polygon-[100%_0,_0%_100%,_100%_100%] bg-inherit',
      className
    )}
  />
);
