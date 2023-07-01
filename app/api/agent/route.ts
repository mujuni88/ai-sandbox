import { messagesSchema } from '@/lib/data';
import { convertToBaseChatMessage, langchainAgents } from '@/lib/langchain';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const { result: res } = await langchainAgents(
    convertToBaseChatMessage(result.data.messages)
  );

  return new NextResponse(res);
}
