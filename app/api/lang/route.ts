import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  BaseChatMessage,
  SystemChatMessage,
  MessageType,
  AIChatMessage,
  HumanChatMessage,
  StoredMessage,
} from 'langchain/schema';
import { Message, messagesSchema } from '@/lib/data';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { langchainStream } from '@/lib/langchain';

const role: z.ZodType<MessageType> = z.enum([
  'human',
  'ai',
  'generic',
  'system',
  'function',
]);

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

export async function POST(request: Request, response: Response) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const messages = [
    systemMessage,
    ...convertToBaseChatMessage(result.data.messages),
  ];

  const stream = langchainStream(messages);

  return new NextResponse(stream);
}

function convertToBaseChatMessage(messages: Message[]): BaseChatMessage[] {
  return messages.map((message) => {
    switch (message.role) {
      case ChatCompletionRequestMessageRoleEnum.User:
        return new HumanChatMessage(message.content);
      case ChatCompletionRequestMessageRoleEnum.Assistant:
        return new AIChatMessage(message.content);
      case ChatCompletionRequestMessageRoleEnum.System:
        return new SystemChatMessage(message.content);
      default:
        return new SystemChatMessage(message.content);
    }
  });
}

function convertToMessage(sm: StoredMessage): Message {
  return {
    id: String(sm.data.content.length),
    content: sm.data.content,
    role:
      sm.type === 'ai'
        ? ChatCompletionRequestMessageRoleEnum.Assistant
        : ChatCompletionRequestMessageRoleEnum.User,
  };
}
