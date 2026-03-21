import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TypeScript + React + Turbopack',
  description: 'Document Markdown Reader Example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
