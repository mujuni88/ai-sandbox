import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const key = '/api/docs';

function fetchDocs(url: string) {
  return fetch(url).then((res) => res.json());
}

function updatePrompt(url: string, { arg }: { arg: { input: string } }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

export const useDocs = () => {
  const [input, setInput] = useState('');
  const { data, isLoading, mutate } = useSWR<string[]>(key, fetchDocs);

  const { isMutating, trigger } = useSWRMutation(key, updatePrompt);

  const handleSubmit = async () => {
    mutate((prev) => {
      if (prev) {
        return [...prev, input];
      }
      return [input];
    }, false);

    const response = await trigger({ input });
    mutate((prev) => {
      if (prev) {
        return [...prev, response];
      }
      return [response];
    }, false);
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return {
    data,
    isLoading,
    isMutating,
    handleSubmit,
    input,
    handleInputChange,
  };
};
