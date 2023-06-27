import { ChangeEvent, useEffect, useRef, useState } from 'react';

export const useAutoResizeTextarea = <V extends string>(value: V) => {
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

  const resetValue = () => {
    if (!textAreaRef.current) return;

    // Reset the height to 0px so that it can be shrinked
    // to the actual height of the content
    textAreaRef.current.style.height = 'auto';
  };

  return {
    textAreaRef,
    resetValue,
  };
};
