import { MessageSchema } from '@/lib/data';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

type RequestBody = {
  messages: MessageSchema[];
};

const fetchKey = `/api/langchain`;

function updatePrompt(
  url: string,
  { arg }: { arg: RequestBody }
): Promise<MessageSchema> {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export const useLangChain = () => {
  const { data, mutate, isLoading } = useSWR<RequestBody>(fetchKey);
  const { trigger, isMutating } = useSWRMutation(fetchKey, updatePrompt);

  const handleSubmit = async (content: string) => {
    const userMessage: MessageSchema = {
      content,
      role: 'user',
    };

    const latestMessages: MessageSchema[] = data?.messages
      ? [...data.messages, userMessage]
      : [userMessage];

    mutate({ messages: latestMessages }, false);

    const response = await trigger({ messages: latestMessages });
    mutate(
      {
        messages: [...latestMessages, response],
      },
      false
    );
  };

  return {
    data,
    isMutating,
    isLoading,
    handleSubmit,
  };
};

function updatePromptStream(url: string, { arg }: { arg: RequestBody }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.body);
}

const decoder = new TextDecoder();
export const useLangChainStream = () => {
  const { data, mutate, isLoading } = useSWR<RequestBody>(fetchKey);
  const { trigger, isMutating } = useSWRMutation(fetchKey, updatePromptStream);

  const handleSubmit = async (content: string) => {
    const userMessage: MessageSchema = {
      content,
      role: 'user',
    };

    const latestMessages: MessageSchema[] = data?.messages
      ? [...data.messages, userMessage]
      : [userMessage];

    mutate({ messages: latestMessages }, false);

    const completion = await trigger({ messages: latestMessages });
    const reader = completion?.getReader();
    if (!reader) return;

    let responseText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      responseText += decoder.decode(value);
      mutate(
        {
          messages: [
            ...latestMessages,
            {
              content: responseText,
              role: ChatCompletionRequestMessageRoleEnum.Assistant,
            },
          ],
        },
        false
      );
    }
  };

  return {
    data,
    isMutating,
    isLoading,
    handleSubmit,
  };
};
