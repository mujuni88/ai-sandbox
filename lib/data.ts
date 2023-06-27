import { CreateMessage, Message } from 'ai';
import { nanoid } from 'nanoid';
import {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessageRoleEnum,
} from 'openai';
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

export const messageSchema: z.ZodType<Message | CreateMessage> = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
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

export const sampleMessages: Message[] = [
  {
    id: nanoid(),
    content: "I'm traveling to Panama, please help\n",
    role: ChatCompletionResponseMessageRoleEnum.User,
  },
  {
    id: nanoid(),
    content:
      "Hello! Welcome to Buza Agency. I'll be glad to assist you with your travel plans to Panama. Can you please provide me with some more information so I can better understand your needs for this trip? ",
    role: ChatCompletionResponseMessageRoleEnum.Assistant,
  },
];
