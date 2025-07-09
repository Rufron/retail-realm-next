
import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode; // Any content passed to the layout (page content)
}

// The main layout wrapper used across all pages
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
