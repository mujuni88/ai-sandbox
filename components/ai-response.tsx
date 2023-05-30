import { cn } from '@/lib/utils';
import { getResponse } from '@/lib/openai';

async function AiResponse() {
  const choice = await getResponse();

  return <div className={cn('flex flex-col gap-2 p-3 w-full')}>{choice}</div>;
}

export default AiResponse as unknown as React.FC;
