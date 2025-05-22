import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SWOT Analyzer - Phân tích SWOT với sức mạnh AI',
  description: 'Công cụ toàn diện để phân tích SWOT, hỗ trợ hoạch định chiến lược và ra quyết định hiệu quả với sự trợ giúp của trí tuệ nhân tạo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="swot-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
