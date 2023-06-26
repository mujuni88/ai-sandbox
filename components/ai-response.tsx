import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiResponse({ text }: { text: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
