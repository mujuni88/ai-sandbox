import { Metadata } from 'next';
import TravelBudgetForm from '@/components/travel-budget-form';

export const metadata: Metadata = {
  title: 'AI Sandbox',
  description: 'A sandbox for AI experiments',
};

export default async function Home() {
  return (
    <main className="container">
      <TravelBudgetForm />
    </main>
  );
}
