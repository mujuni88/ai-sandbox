import { ChatCompletionResponseMessageRoleEnum } from 'openai';
import { useCallback, useReducer } from 'react';

type Message = {
  id?: string;
  content: string;
  role: ChatCompletionResponseMessageRoleEnum;
};
type State = {
  input: string;
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
      type: 'SET_INPUT';
      payload: string;
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
const reducer = (state: State, action: Action): State => {
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
    case 'SET_INPUT':
      return {
        ...state,
        input: action.payload,
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

export const useChat = () => {
  const [state, dispatch] = useReducer(reducer, {
    input: '',
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

  const setInput = useCallback(
    (input: string) => {
      dispatch({ type: 'SET_INPUT', payload: input });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
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
      const completion = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: latestMessages }),
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
      setInput,
    },
    handleSubmit,
  };
};
