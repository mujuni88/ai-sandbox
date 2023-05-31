import { cn } from '@/lib/utils';
import { getResponse } from '@/lib/openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function AiResponse() {
  const choice = await getResponse();
  return (
    <div className={cn('prose')}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{choice}</ReactMarkdown>
    </div>
  );
}

export default AiResponse as unknown as React.FC;
