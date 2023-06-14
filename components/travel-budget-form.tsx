'use client';
import AiResponse from '@/components/ai-response';
import { SubmitButton } from '@/components/submit-button';
import { Metadata } from 'next';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { useChat } from './useChat/useChat';
import { cn } from '@/lib/utils';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Bot, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default function TravelBudgetForm() {
  const { state, handleSubmit, actions } = useChat();
  const { isLoading, messages, input } = state;

  return (
    <div className="grid w-full grid-rows-[1fr_auto] mr-auto ml-auto pt-3 md:w-1/2">
      <div className="flex overflow-auto">
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('grid gap-3 grid-cols-[auto_1fr]')}>
              <Avatar initials={msg.role} role={msg.role} />
              <div
                className={cn('flex gap-3 p-5 rounded-2xl shadow-md', {
                  'bg-gray-100':
                    msg.role === ChatCompletionRequestMessageRoleEnum.Assistant,
                  'bg-indigo-100':
                    msg.role === ChatCompletionRequestMessageRoleEnum.User,
                })}
              >
                <AiResponse text={msg.content} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full mt-3 mb-8">
        <CardContent className="pt-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Textarea
              name="content"
              id="content"
              value={input}
              onChange={(e) => actions.setInput(e.target.value)}
            />
            <SubmitButton disabled={isLoading} loading={isLoading} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const Avatar = ({
  initials,
  role,
}: {
  initials: string;
  role: ChatCompletionRequestMessageRoleEnum;
}) => {
  const user = role === ChatCompletionRequestMessageRoleEnum.User;
  return (
    <span
      className={cn(
        'text-center font-bold text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0',
        {
          'bg-gray-500':
            role === ChatCompletionRequestMessageRoleEnum.Assistant,
          'bg-indigo-500': role === ChatCompletionRequestMessageRoleEnum.User,
        }
      )}
    >
      {user ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
    </span>
  );
};
