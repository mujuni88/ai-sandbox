import { KeyboardEvent, useRef } from 'react';

export const useEnterSubmit = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeydown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return {
    formRef,
    onKeyDown: handleKeydown,
  };
};
