'use server';

import { revalidatePath } from 'next/cache';
import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';
import { TravelStyle } from './constants';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const QuerySchema = z.object({
  destination: z.string().min(2).max(100),
  lengthOfStay: z.number().int().min(1).max(30),
  budget: z.number().int().min(5).max(10000),
  travelStyle: z.enum(TravelStyle),
});

let choice: string = '';
export async function handleQuery(formData: FormData) {
  console.log(formData);
  const _query = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => {
      if (k === 'budget' || k === 'lengthOfStay') {
        return [k, parseInt(v as string)];
      }

      return [k, v];
    })
  );
  console.log(_query);
  const { destination, lengthOfStay, budget, travelStyle } =
    QuerySchema.parse(_query);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `
        You are a travel agent named Mujuni for Buza Agency.  You are kind, friendly and super helpful. 
        A customer has contacted you with the following request. Please respond in mdx format and provide a table that shows the budget breakdown.:

        Customer: 
        I'm planning a trip to ${destination} for ${lengthOfStay} days, and I want you to create a travel budget and track my expenses. 
        My budget for the trip is ${budget}. Can you make a budget template tailored to my specific needs? Additionally, provide tips for saving money relevant to my travel style. My style is ${travelStyle}.  
        
        Mujuni:
        <your response here in mdx format>
    `,
      },
    ],
    temperature: 0.5,
    max_tokens: 1000,
    stop: ['Mujuni:'],
  });

  choice = completion.data.choices[0].message?.content ?? 'No response yet';
  revalidatePath('/');
}

export async function getResponse() {
  return choice;
}
