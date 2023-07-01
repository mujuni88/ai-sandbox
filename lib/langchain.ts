import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  BaseChatMessage,
  HumanChatMessage,
  StoredMessage,
  SystemChatMessage,
} from 'langchain/schema';
import { DynamicStructuredTool, SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { env } from 'process';
import { z } from 'zod';
import { MessageSchema } from './data';

export function langchainStream(messages: BaseChatMessage[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chat = new ChatOpenAI({
        temperature: 0.8,
        streaming: true,
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              controller.enqueue(encoder.encode(token));
            },
            handleLLMEnd() {
              controller.close();
            },
          },
        ],
      });

      await chat.call(messages);
    },
  });
  return stream;
}

export function convertToBaseChatMessage(
  messages: MessageSchema[]
): BaseChatMessage[] {
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

export function convertToMessage(sm: StoredMessage): MessageSchema {
  return {
    id: String(sm.data.content.length),
    content: sm.data.content,
    role:
      sm.type === 'ai'
        ? ChatCompletionRequestMessageRoleEnum.Assistant
        : ChatCompletionRequestMessageRoleEnum.User,
  };
}

export const langchainAgents = async (messages: BaseChatMessage[]) => {
  const model = new ChatOpenAI({
    temperature: 0,
  });

  const tools = [
    new SerpAPI(env.SERP_API_KEY, {
      location: 'California,Redwood City,United States',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
    new DynamicStructuredTool({
      name: 'random-name-generator',
      description:
        'Generates random names between three inputs. firstLetter, lastLetter, and length',
      schema: z.object({
        firstLetter: z.string().min(1).max(1),
        lastLetter: z.string().min(1).max(1),
        length: z.number().int().min(2).max(10),
      }),
      func: async ({ firstLetter, lastLetter, length }) => {
        const firstLetterCode = firstLetter.charCodeAt(0);
        const lastLetterCode = lastLetter.charCodeAt(0);

        let letters = '';
        Array.from({ length: length - 2 }).forEach(() => {
          const randomLetterCode = Math.floor(
            Math.random() * (lastLetterCode - firstLetterCode) + firstLetterCode
          );
          letters += String.fromCharCode(randomLetterCode);
        });

        return `${firstLetter}${letters}${lastLetter}`;
      },
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'openai-functions',
    verbose: true,
  });

  const result = await executor.run(messages.at(-1)?.text);

  return { result };
};
