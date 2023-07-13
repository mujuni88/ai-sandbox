import { Redis } from '@upstash/redis';
import { ChatSchema, MessageSchema, chatSchema, chatsSchema } from './data';

export const redis = Redis.fromEnv();

const RedisKeys = {
  chats: (id?: string) => 'chats',
  chatId: (id: string) => `chats:${id}`,
};

export const getAllChats = async () => {
  const messages = await redis.json.get(RedisKeys.chats());

  return messages ? chatsSchema.parse(messages) : [];
};

export const getChatById = async (id: string) => {
  const messages = await redis.json.get(RedisKeys.chatId(id));

  return messages ? chatSchema.parse(messages) : null;
};

export const addChat = async (newChat: ChatSchema) => {
  const _newChat = chatSchema.parse(newChat);

  const chats = await getAllChats();
  const filteredChats = chats.filter((chat) => chat.id !== _newChat.id);
  const newChats = [_newChat, ...filteredChats];

  await redis.json.set(RedisKeys.chats(), '$', newChats);

  return newChats;
};

export const addMessageToChat = async (
  id: string,
  messages: MessageSchema[]
) => {
  let chat = await getChatById(id);

  if (!chat) {
    chat = chatSchema.parse({
      id,
      createdAt: new Date().toISOString(),
      messages,
    });
  }

  const newChat = chatSchema.parse({
    ...chat,
    messages,
  });

  await redis.json.set(RedisKeys.chatId(id), '$', newChat);

  addChat(newChat);

  return chatSchema.parse(newChat);
};

export const deleteChatById = async (id: string) => {
  const result = await redis.json.del(RedisKeys.chatId(id));

  return result;
};

export const deleteAllChats = async () => {
  const result = await redis.json.del(RedisKeys.chats());

  return result;
};
