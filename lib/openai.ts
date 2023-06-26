'use server';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { env } from '@/env';
import { IncomingMessage } from 'http';

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getOpenAiStream(
  messages: ChatCompletionRequestMessage[]
): Promise<ReadableStream> {
  const response = await openai.createChatCompletion(
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
          Act as a travel agent for a customer. 
          The name of the agency is Buza Agency. 
          The goal is to make sure the customer receives the solution to her problem. 
          
          Walk the customer through a series of questions to find out what she needs.
          Make sure to verify that the customer is satisfied with the solution.

          Respond in markdown format.
          `,
        },
        ...messages,
      ],
      temperature: 0.5,
      stream: true,
    },
    { responseType: 'stream' }
  );

  const incomingMessage = response.data as unknown as IncomingMessage;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      incomingMessage.on('data', (chunk) => {
        const lines = chunk
          .toString()
          .split('\n')
          .filter((c: string) => Boolean(c.trim()));

        for (const line of lines) {
          const data = line.slice('data:'.length).trim();

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices[0].delta?.content || '';
            controller.enqueue(encoder.encode(content));
          } catch (e) {
            console.error(e);
          }
        }
      });
    },
  });

  return stream;
}
