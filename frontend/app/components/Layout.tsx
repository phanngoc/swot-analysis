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
  // Custom colors based on menu items
  const getMenuColor = () => {
    if (href === '/') return 'text-blue-600 dark:text-blue-400';
    if (href === '/analysis') return 'text-emerald-600 dark:text-emerald-400';
    if (href === '/strategies') return 'text-purple-600 dark:text-purple-400';
    if (href === '/projects') return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-700 dark:text-gray-300';
  };
  
  const getActiveStyles = () => {
    const baseStyle = 'bg-gradient-to-r';
    if (href === '/') return `${baseStyle} from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/40 border-l-4 border-blue-500`;
    if (href === '/analysis') return `${baseStyle} from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40 border-l-4 border-emerald-500`;
    if (href === '/strategies') return `${baseStyle} from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/40 border-l-4 border-purple-500`;
    if (href === '/projects') return `${baseStyle} from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/40 border-l-4 border-amber-500`;
    return '';
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
        isActive 
          ? `${getActiveStyles()} font-medium ${getMenuColor()}` 
          : 'border-l-4 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
      }`}
    >
      <Icon size={20} className={isActive ? getMenuColor() : 'text-gray-500 dark:text-gray-400'} />
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
    <div className="flex min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Sidebar for desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-r-gray-200 dark:border-r-gray-800 shadow-lg md:shadow-none md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center px-6 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
          <Link href="/" className="flex items-center gap-3 w-full">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SWOT Analyzer</span>
          </Link>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-3">
              Strategic Tools
            </h3>
            <nav className="flex flex-col gap-2">
              <SidebarItem
                icon={FileText}
                label="Dashboard"
                href="/"
                isActive={pathname === '/'}
              />
              <SidebarItem
                icon={BarChart}
                label="SWOT Analysis"
                href="/analysis"
                isActive={pathname === '/analysis'}
              />
              <SidebarItem
                icon={Settings}
                label="Strategy Engine"
                href="/strategies"
                isActive={pathname === '/strategies'}
              />
              <SidebarItem
                icon={FileText}
                label="My Projects"
                href="/projects"
                isActive={pathname === '/projects'}
              />
            </nav>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 text-sm">Strategy Insights</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Analyze your strategic position and discover new opportunities.</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-6 lg:px-8 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="ml-4 hidden md:flex items-center gap-1">
            <div className="h-8 w-1 bg-blue-500 rounded-full" />
            <div className="h-8 w-1 bg-emerald-500 rounded-full ml-1" />
            <div className="h-8 w-1 bg-purple-500 rounded-full ml-1" />
            <div className="h-8 w-1 bg-amber-500 rounded-full ml-1" />
          </div>
          
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200 ml-4">
            {pathname === '/' && 'Strategic Dashboard'}
            {pathname === '/analysis' && 'SWOT Analysis Matrix'}
            {pathname === '/strategies' && 'Strategy Development'}
          </h1>
          
          <div className="ml-auto flex items-center gap-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <Moon size={20} className="text-indigo-600 dark:text-indigo-400" /> : 
                <Sun size={20} className="text-amber-500" />
              }
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-5 lg:p-8 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
