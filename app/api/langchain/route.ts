import { messagesSchema } from '@/lib/data';
import { convertToBaseChatMessage } from '@/lib/langchain';
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

export async function GET() {
  return NextResponse.json({ messages: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const messages = [
    systemMessage,
    ...convertToBaseChatMessage(result.data.messages),
  ];

  const { stream, handlers } = LangChainStream();

  const chat = new ChatOpenAI({
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

  chat.call(messages).catch((error) => {
    console.error(error);
  });

  return new StreamingTextResponse(stream);
}
