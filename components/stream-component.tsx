'use client';
import { useEffect, useState } from 'react';

export default function StreamComponent() {
  const [stream, setStream] = useState('');
  useEffect(() => {
    async function fetchStream() {
      const response = await fetch('/api/ai');
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        done = d;
        const chunk = decoder.decode(value);
        setStream(chunk);
      }
    }

    fetchStream();
  }, []);

  return <div className="flex flex-col items-center w-1/3">{stream}</div>;
}
