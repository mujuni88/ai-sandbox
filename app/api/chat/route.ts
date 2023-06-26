import { NextResponse } from 'next/server';
import { getOpenAiStream } from '@/lib/openai';
import { messagesSchema } from '@/lib/data';

export async function POST(request: Request) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
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
