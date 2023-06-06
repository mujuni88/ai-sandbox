'use client';
import AiResponse from '@/components/ai-response';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDeferredValue, useRef, useState } from 'react';
import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
} from 'openai';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default function TravelBudgetForm() {
  const [loading, setLoading] = useState(false);
  const msgRef = useRef<ChatCompletionResponseMessage[]>([]);
  const [response, setResponse] = useState('');
  const deferedValue = useDeferredValue(response);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    const userMessage = {
      role: ChatCompletionResponseMessageRoleEnum.User,
      content,
    };

    msgRef.current.push(userMessage);

    setLoading(true);
    try {
      const completion = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: msgRef.current }),
      });

      const reader = completion.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      if (!reader) return;

      let tempResponse = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          const newMessage = {
            role: ChatCompletionResponseMessageRoleEnum.Assistant,
            content: tempResponse,
          };
          msgRef.current.push(newMessage);
          break;
        }

        tempResponse += value;
        setResponse((r) => r + value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-1/3">
      <Card className="w-full mb-5">
        <CardHeader>
          <CardTitle>Travel Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Label htmlFor="content">Enter Your Travel Needs</Label>
            <Input className="mt-2" name="content" id="content" />
            <SubmitButton disabled={loading} />
          </form>
        </CardContent>
      </Card>
      <div>
        <div className="flex flex-col gap-10">
          {msgRef.current.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <h3 className="bold text-xl">{msg.role}</h3>
              <p className="prose">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
      <AiResponse text={deferedValue} />
    </div>
  );
}
