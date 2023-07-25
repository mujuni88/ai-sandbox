import { langchainMemory } from '@/lib/langchain';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  return NextResponse.json({ messages: [] });
}

const inputSchema = z.object({
  input: z.string().nonempty(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input } = inputSchema.parse(body);

    const mem = await langchainMemory(input);
    console.log('mem', mem);

    return NextResponse.json(mem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json({ message: error }, { status: 500 });
  }
}
