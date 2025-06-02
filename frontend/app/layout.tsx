import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ui/use-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SWOT Analyzer - Phân tích SWOT với sức mạnh AI',
  description: 'Công cụ toàn diện để phân tích SWOT, hỗ trợ hoạch định chiến lược và ra quyết định hiệu quả với sự trợ giúp của trí tuệ nhân tạo.',
  keywords: 'SWOT analysis, strategic planning, business tools, strengths, weaknesses, opportunities, threats, AI analysis',
  authors: [{ name: 'SWOT Analyzer Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://swot-analyzer.com',
    siteName: 'SWOT Analyzer',
    title: 'SWOT Analyzer - AI-Powered SWOT Analysis Tool',
    description: 'Comprehensive SWOT analysis tool with AI-powered insights to help you make better strategic decisions',
    images: [
      {
        url: 'https://swot-analyzer.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SWOT Analyzer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SWOT Analyzer - AI-Powered SWOT Analysis',
    description: 'Comprehensive SWOT analysis tool with AI-powered insights to help you make better strategic decisions',
    images: ['https://swot-analyzer.com/twitter-image.png']
  }
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
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
