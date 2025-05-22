'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, FileText, LucideIcon, Menu, Moon, Settings, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
        isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-background border-r md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart className="h-6 w-6 text-primary" />
            <span>SWOT Analyzer</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <SidebarItem
            icon={FileText}
            label="Home"
            href="/"
            isActive={pathname === '/'}
          />
          <SidebarItem
            icon={BarChart}
            label="Analysis"
            href="/analysis"
            isActive={pathname === '/analysis'}
          />
          <SidebarItem
            icon={Settings}
            label="Strategies"
            href="/strategies"
            isActive={pathname === '/strategies'}
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4 lg:px-6">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
