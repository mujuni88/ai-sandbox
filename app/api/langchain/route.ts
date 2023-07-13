import { messagesSchema } from '@/lib/data';
import { convertToBaseChatMessage } from '@/lib/langchain';
import { getChatById } from '@/lib/reddis';
import { LangChainStream, StreamingTextResponse } from 'ai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemChatMessage } from 'langchain/schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const systemMessage = new SystemChatMessage(
  `
  Act as a travel agent for a customer. 
  The name of the agency is Buza Agency. 
  The goal is to make sure the customer receives the solution to her problem. 
  Do not use any personal information about the customer. 

  Walk the customer through a series of questions to find out what she needs.
  Make sure to verify that the customer is satisfied with the solution.

  Respond in markdown format.
`
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'id is required' }, { status: 400 });
  }

  const chat = getChatById(id);

  console.log('id', id);
  console.log('chat', chat);

  return NextResponse.json({ messages: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const chat = messagesSchema.safeParse(body);
  if (!chat.success) {
    return NextResponse.json({ message: chat.error }, { status: 400 });
  }

  const messages = [
    systemMessage,
    ...convertToBaseChatMessage(chat.data.messages),
  ];

  const { stream, handlers } = LangChainStream({
    onCompletion: async (message) => {},
  });

  const llm = new ChatOpenAI({
    temperature: 0.8,
    streaming: true,
    callbacks: [
      {
        ...handlers,
        handleLLMEnd() {
          handlers.handleChainEnd();
        },
      },
    ],
  });

  llm.call(messages).catch((error) => {
    console.error(error);
  });

  return new StreamingTextResponse(stream);
}
