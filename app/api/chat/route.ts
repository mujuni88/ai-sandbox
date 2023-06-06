import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { z } from 'zod';
import { getOpenAiStream } from '@/lib/openai';

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum([
        ChatCompletionRequestMessageRoleEnum.User,
        ChatCompletionRequestMessageRoleEnum.System,
        ChatCompletionRequestMessageRoleEnum.Assistant,
      ]),
      content: z.string(),
    })
  ),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = messageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };

  const stream = await getOpenAiStream(result.data.messages);

  return new NextResponse(stream, { headers });
}
