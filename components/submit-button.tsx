'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { SentIcon } from './ui/SentIcon';
import { Button, ButtonProps } from './ui/button';

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
      className={cn('flex items-center', className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : <SentIcon size={16} />}
    </Button>
  );
}
