import AiResponse from '@/components/ai-response';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { handleQuery } from '@/lib/openai';
import { Metadata } from 'next';
import { TravelStyle } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Suspense } from 'react';
import AiResponseLoader from './ai-response-loader';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default async function TravelBudgetForm() {
  return (
    <div className="flex flex-col items-center w-1/3">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Travel Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleQuery} className="flex flex-col gap-3">
            <Label htmlFor="destination">
              Enter Destination
              <Input className="mt-2" name="destination" id="destination" />
            </Label>
            <Label htmlFor="budget">
              Enter Budget
              <Input className="mt-2" name="budget" id="budget" type="number" />
            </Label>
            <Label htmlFor="lengthOfStay">
              Enter length of stay (days)
              <Input
                className="mt-2"
                name="lengthOfStay"
                id="lengthOfStay"
                type="number"
              />
            </Label>
            <Label htmlFor="travelStyle">
              Enter Travel Style
              <Select name="travelStyle">
                <SelectTrigger id="travelStyle" className="mt-2">
                  <SelectValue placeholder="Travel Style" />
                </SelectTrigger>
                <SelectContent>
                  {TravelStyle.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<AiResponseLoader />}>
        <AiResponse />
      </Suspense>
    </div>
  );
}
