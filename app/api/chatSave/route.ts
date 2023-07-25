import { chatSchema } from '@/lib/data';
import { addMessageToChat } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  const body = await request.json();
  const chat = chatSchema.safeParse(body);
  if (!chat.success) {
    return NextResponse.json({ message: chat.error }, { status: 400 });
  }

  try {
    await addMessageToChat(chat.data.id, chat.data.messages);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'unknown error' }, { status: 400 });
  }

  return NextResponse.json({ message: 'ok' });
}
