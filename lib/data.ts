import { faker } from '@faker-js/faker';
import { Message } from 'ai';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { z } from 'zod';
import { TravelStyle } from './constants';

export const querySchema = z.object({
  destination: z
    .string({
      invalid_type_error: 'Destination must be a string',
    })
    .min(2)
    .max(100),
  lengthOfStay: z
    .number({
      invalid_type_error: 'Length of stay must be a number',
    })
    .int()
    .min(1)
    .max(30)
    .optional()
    .default(1),
  budget: z
    .number({
      invalid_type_error: 'Budget must be a number',
    })
    .int()
    .min(5)
    .max(10000)
    .optional()
    .default(100),
  travelStyle: z
    .enum(TravelStyle, {
      invalid_type_error:
        'Travel style must be one of the following: ' + TravelStyle.join(', '),
    })
    .optional()
    .default(TravelStyle[0]),
});

export type Query = z.infer<typeof querySchema>;

export const messageSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  role: z.enum([
    ChatCompletionRequestMessageRoleEnum.User,
    ChatCompletionRequestMessageRoleEnum.System,
    ChatCompletionRequestMessageRoleEnum.Assistant,
  ]),
  content: z.string(),
});

export const messagesSchema = z.object({
  messages: z.array(messageSchema),
});

export type MessageSchema = z.infer<typeof messageSchema>;

export const generateMessages = (num: number = 10) => {
  const messages = [];

  for (let i = 0; i < num; i++) {
    const id = faker.string.uuid();
    const role = faker.helpers.arrayElement(['user', 'assistant']);
    const content = faker.lorem.sentence();

    const message = {
      id,
      role,
      content,
    };

    messages.push(message);
  }

  return messages as Message[];
};

export const chatSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime().optional(),
  messages: z.array(messageSchema),
});

export const chatsSchema = z.array(chatSchema);

export type ChatSchema = z.infer<typeof chatSchema>;
