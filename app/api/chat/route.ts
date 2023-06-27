import { NextResponse } from 'next/server';
import { messagesSchema } from '@/lib/data';
import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { env } from '@/env';

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const runtime = 'edge';

export async function POST(request: Request) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: result.data.messages,
    stream: true,
    max_tokens: 200,
    temperature: 0.5,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
