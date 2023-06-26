import { useRef } from 'react';

export const useScrollIntoView = <T extends HTMLElement>() => {
  const scrollEl = useRef<T>(null);

  const scrollIntoView = () => {
    if (scrollEl.current) {
      scrollEl.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    scrollIntoView,
    scrollEl,
  };
};
