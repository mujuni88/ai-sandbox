'use client';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
}

export function SubmitButton({ loading, ...props }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="bg-indigo-700"
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Submit
    </Button>
  );
}
