import { cn } from '@/lib/utils';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Bot, User } from 'lucide-react';

export function Avatar({
  className,
  role,
}: {
  role: ChatCompletionRequestMessageRoleEnum;
  className?: string;
}) {
  const user = role === ChatCompletionRequestMessageRoleEnum.User;
  return (
    <span
      className={cn(
        'text-center font-bold text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0',
        {
          'bg-gray-500':
            role === ChatCompletionRequestMessageRoleEnum.Assistant,
          'bg-indigo-500': role === ChatCompletionRequestMessageRoleEnum.User,
        },
        className
      )}
    >
      {user ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
    </span>
  );
}
