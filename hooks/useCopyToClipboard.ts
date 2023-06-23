import { useState } from 'react';

export const useCopyToClipboard = ({ timeout = 2000 }: { timeout: number }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    if (
      typeof window === 'undefined' ||
      !navigator.clipboard?.writeText ||
      !text.trim()
    ) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), timeout);
  };

  return {
    copyToClipboard,
    isCopied,
  };
};
