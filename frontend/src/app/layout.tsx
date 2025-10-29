// frontend/src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CRM Vendas Fotovoltaicas',
  description: 'Sistema inovador de gestão de vendas fotovoltaicas com dashboard avançado',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className="h-full"> {/* CORREÇÃO AQUI: Removido 'dark' e adicionado 'h-full' */}
        {children}
      </body>
    </html>
  );
}
