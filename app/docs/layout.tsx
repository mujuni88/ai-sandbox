export const metadata = {
  title: 'Doc Site',
  description: 'Contains my markdown files',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="grid place-items-center py-10">{children}</main>;
}
