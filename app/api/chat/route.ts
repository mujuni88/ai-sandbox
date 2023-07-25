import { env } from '@/env';
import { messagesSchema } from '@/lib/data';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
