import { ChatCompletionResponseMessageRoleEnum } from 'openai';
import { useCallback, useReducer, useRef } from 'react';

export type Message = {
  id?: string;
  content: string;
  role: ChatCompletionResponseMessageRoleEnum;
};
type State = {
  messages: Message[];
  isLoading: boolean;
};

type Optional<T, Key extends keyof T> = Pick<Partial<T>, Key> & Omit<T, Key>;

const STREAMED_MSG_ID = 'streamedMessage';
type Action =
  | {
      type: 'ADD_MESSAGE';
      payload: Message;
    }
  | {
      type: 'SET_STREAMED_MESSAGE';
      payload: Message;
    }
  | {
      type: 'SET_IS_LOADING';
      payload: boolean;
    }
  | {
      type: 'RESET';
    };

const messages: Message[] = [
  {
    content: "I'm traveling to Panama, please help\n",
    role: ChatCompletionResponseMessageRoleEnum.User,
  },
  {
    content:
      "Hello! Welcome to Buza Agency. I'll be glad to assist you with your travel plans to Panama. Can you please provide me with some more information so I can better understand your needs for this trip? ",
    role: ChatCompletionResponseMessageRoleEnum.Assistant,
  },
];
export const chatReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: `${action.payload.content.length}`,
          },
        ],
      };
    case 'SET_STREAMED_MESSAGE':
      const prevStreamedMessage = state.messages.find(
        (msg) => msg.id === STREAMED_MSG_ID
      );

      const streamedMessage = {
        ...action.payload,
        content: (prevStreamedMessage?.content ?? '') + action.payload.content,
        id: STREAMED_MSG_ID,
      };

      return {
        ...state,
        messages: [
          ...state.messages.filter((msg) => msg.id !== STREAMED_MSG_ID),
          {
            ...streamedMessage,
          },
        ],
      };
    case 'SET_IS_LOADING':
      if (action.payload === false && state.isLoading === true) {
        const prevStreamedMessage = state.messages.find(
          (msg) => msg.id === STREAMED_MSG_ID
        );

        return {
          ...state,
          isLoading: action.payload,
          messages: [
            ...state.messages.filter((msg) => msg.id !== STREAMED_MSG_ID),
            {
              ...prevStreamedMessage,
              content: prevStreamedMessage?.content ?? '',
              id: `${prevStreamedMessage?.content.length}`,
              role: ChatCompletionResponseMessageRoleEnum.Assistant,
            },
          ],
        };
      }

      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESET':
      return {
        ...state,
        messages: [],
        isLoading: false,
      };
    default:
      return state;
  }
};

export type Reducer = typeof chatReducer;

export const useChat = (reducer: Reducer = chatReducer) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    messages,
    isLoading: false,
  });

  const addMessage = useCallback(
    (message: Optional<Message, 'id'>) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          ...message,
          id: message.id ?? String(message.content.length),
        },
      });
    },
    [dispatch]
  );

  const setCurrentMessage = useCallback(
    (message: Message) => {
      dispatch({
        type: 'SET_STREAMED_MESSAGE',
        payload: {
          ...message,
        },
      });
    },
    [dispatch]
  );

  const setIsLoading = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    const userMessage = {
      content,
      role: ChatCompletionResponseMessageRoleEnum.User,
      id: String(content.length),
    };

    addMessage(userMessage);
    const latestMessages = [...state.messages, userMessage];

    setIsLoading(true);
    try {
      abortControllerRef.current = new AbortController();
      const completion = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: latestMessages }),
        signal: abortControllerRef.current.signal,
      });

      const reader = completion.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      if (!reader) return;

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        setCurrentMessage({
          id: STREAMED_MSG_ID,
          content: value,
          role: ChatCompletionResponseMessageRoleEnum.Assistant,
        });

        if (abortControllerRef.current?.signal.aborted) {
          break;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    actions: {
      addMessage,
      setCurrentMessage,
      setIsLoading,
      reset,
    },
    handleSubmit,
    stopStream: () => {
      abortControllerRef.current?.abort();
    },
  };
};
