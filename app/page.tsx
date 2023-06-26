import { Metadata } from 'next';
import TravelBudgetForm from '@/components/travel-budget-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LangChainForm from '@/components/lang-chain-form';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default async function Home() {
  return (
    <main className="container h-[100dvh] max-h-[100dvh] pt-16">
      <Tabs
        defaultValue="langChain"
        className="w-full h-full pt-6 md:w-[60%] mx-auto grid grid-rows-[auto_1fr]"
      >
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger
            value="openAi"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            Open AI
          </TabsTrigger>
          <TabsTrigger
            value="langChain"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            LangChain
          </TabsTrigger>
        </TabsList>
        <TabsContent value="openAi" asChild>
          <TravelBudgetForm />
        </TabsContent>
        <TabsContent value="langChain" asChild>
          <LangChainForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}
