'use client';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';
import { SentIcon } from './ui/SentIcon';

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
}

export function SubmitButton({
  loading,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn('bg-indigo-500 flex items-center', className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : <SentIcon size={16} />}
    </Button>
  );
}
