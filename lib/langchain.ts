import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  BaseChatMessage,
  HumanChatMessage,
  StoredMessage,
  SystemChatMessage,
} from 'langchain/schema';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
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
