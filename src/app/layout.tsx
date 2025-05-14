import { Metadata } from 'next';
import { ClientProvider } from './clientProvider';

export const metadata: Metadata = {
  title: 'BCL',
  description: 'Block Chain Lures Web',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang="ja">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
