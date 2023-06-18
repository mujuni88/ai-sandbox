import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiResponse({ text }: { text: string }) {
  console.log({ text });
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
}
