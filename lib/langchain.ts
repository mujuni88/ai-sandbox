import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseChatMessage } from 'langchain/schema';

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
