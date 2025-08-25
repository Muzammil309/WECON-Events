'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Menu, X, Sparkles, Calendar, Ticket, BarChart3, Monitor, LogIn, UserPlus } from 'lucide-react';
import clsx from 'clsx';

export function Navbar() {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  const navItem = (href: string, label: string, Icon?: any) => (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      {Icon ? <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" /> : null}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold tracking-wide">WECON Masawat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItem('/agenda', 'Agenda', Calendar)}
            {navItem('/tickets', 'Tickets', Ticket)}
            {navItem('/analytics', 'Analytics', BarChart3)}
            {navItem('/signage', 'Signage', Monitor)}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={clsx('md:hidden overflow-hidden transition-[max-height] duration-300', open ? 'max-h-96' : 'max-h-0')}>
          <div className="py-4 grid gap-2">
            {/* Navigation Links */}
            {navItem('/agenda', 'Agenda', Calendar)}
            {navItem('/tickets', 'Tickets', Ticket)}
            {navItem('/analytics', 'Analytics', BarChart3)}
            {navItem('/signage', 'Signage', Monitor)}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-fuchsia-700 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
