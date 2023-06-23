import Link from 'next/link';

export const PageHeader = () => (
  <header className="flex flex-col p-5 absolute inset-0 h-16 bg-indigo-700">
    <Link href={'/'}>
      <h1 className="text-xl font-semibold text-white">Buza Agency</h1>
    </Link>
  </header>
);
