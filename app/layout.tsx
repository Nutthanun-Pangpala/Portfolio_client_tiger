
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nutthanun Pengpala | Developer Portfolio',
  description:
    'Software developer portfolio featuring projects, skills, and experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
