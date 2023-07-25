import { faker } from '@faker-js/faker';
import { Message } from 'ai';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { z } from 'zod';
import { ITEM_MAX_COUNT, TravelStyle } from './constants';

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
    .max(ITEM_MAX_COUNT)
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
  const messages: Message[] = [];

  for (let i = 0; i < num; i++) {
    const id = faker.string.uuid();
    const role = faker.helpers.arrayElement([
      ChatCompletionRequestMessageRoleEnum.User,
      ChatCompletionRequestMessageRoleEnum.Assistant,
    ]);
    const content = faker.lorem.sentence();

    const message: Message = {
      id,
      role,
      content,
    } satisfies Message;

    messages.push(message);
  }

  return messages;
};

export const chatSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  messages: z.array(messageSchema),
});

export const generateChats = (num: number, chatId?: string) => {
  const chats: ChatSchema[] = [];
  for (let i = 0; i < num; i++) {
    const id = chatId ?? faker.string.uuid();
    const messages = generateMessages(
      Math.floor(Math.random() * ITEM_MAX_COUNT) + 1
    );
    const createdAt = faker.date.anytime().toISOString();
    const title = faker.lorem.slug();

    const chat = {
      id,
      title,
      messages,
      createdAt,
    } as ChatSchema;

    chats.push(chat);
  }

  return chats;
};

export const chatsSchema = z.array(chatSchema);

export type ChatSchema = z.infer<typeof chatSchema>;

let chats: ChatSchema[] = [];
export const getChats = (num?: number) => {
  if (!chats.length) {
    chats = generateChats(num || ITEM_MAX_COUNT);
  }

  return chats;
};

export function getChatById(id: string) {
  let chat = getChats().find((c) => c.id === id);
  if (!chat) chat = generateChats(1, id)[0];

  chats.push(chat);

  return chat;
}
