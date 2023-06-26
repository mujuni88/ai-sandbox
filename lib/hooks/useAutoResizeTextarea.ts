import { ChangeEvent, useEffect, useRef, useState } from 'react';

export const useAutoResizeTextarea = () => {
  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const $textArea = textAreaRef.current;
    if (!$textArea) return;

    if (value === '') {
      $textArea.style.height = 'auto';
      return;
    }

    $textArea.style.height = $textArea.scrollHeight + 'px';
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const resetValue = () => {
    setValue('');
    if (!textAreaRef.current) return;

    // Reset the height to 0px so that it can be shrinked
    // to the actual height of the content
    textAreaRef.current.style.height = 'auto';
  };

  return {
    textAreaRef,
    handleChange,
    value,
    resetValue,
  };
};
