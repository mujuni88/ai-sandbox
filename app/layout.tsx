import { PageHeader } from '@/components/page-header';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageHeader />
          <div className="overflow-auto h-body">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
