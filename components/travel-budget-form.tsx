'use client';
import AiResponse from '@/components/ai-response';
import { SubmitButton } from '@/components/submit-button';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useChat } from './useChat/useChat';
import { cn } from '@/lib/utils';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default function TravelBudgetForm() {
  const { state, handleSubmit, actions } = useChat();
  const { isLoading, messages, input } = state;

  return (
    <div className="flex flex-col items-center w-full mr-auto ml-auto mt-6 md:w-1/2">
      <Card className="w-full mb-5">
        <CardHeader>
          <CardTitle className="text-center">
            What are you travel needs?
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <div>
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3 items-center', {
                'bg-gray-100 p-5':
                  msg.role === ChatCompletionRequestMessageRoleEnum.User,
                'bg-indigo-100 p-5 justify-items-end flex-row-reverse':
                  msg.role === ChatCompletionRequestMessageRoleEnum.Assistant,
              })}
            >
              <Avatar initials={msg.role} role={msg.role} />
              <AiResponse text={msg.content} />
            </div>
          ))}
        </div>
      </div>
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
  return (
    <p
      className={cn(
        'text-center font-bold text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0',
        {
          'bg-gray-500': role === ChatCompletionRequestMessageRoleEnum.User,
          'bg-indigo-500':
            role === ChatCompletionRequestMessageRoleEnum.Assistant,
        }
      )}
    >
      {role.slice(0, 2).toUpperCase()}
    </p>
  );
};
