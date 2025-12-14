// 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';//Gets the current URL path
import { Moon, Sun, ShoppingCart } from 'lucide-react';// Icons
import { Button } from '@/components/ui/button';// Custom-styled button
import { useSession, signOut } from "next-auth/react"
import { CartSheet } from '../cart/cart-sheet';


// Header component displayed on all pages
export const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Load and apply saved theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Handles theme toggle button click
  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/products"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            Retail Product Dashboard
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/products' || pathname === '/'
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              Products
            </Link>
            {session ? (
              <>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/profile'
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  Profile
                </Link>
                {/* Add more authenticated links here if needed */}
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/auth/login'
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/auth/register'
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <CartSheet />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {session && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
