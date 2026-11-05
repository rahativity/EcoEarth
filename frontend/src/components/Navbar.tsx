'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Moon,
  Sun,
  Globe,
  Check,
  Menu,
  X,
  Home,
  Wind,
  Droplets,
  MountainSnow,
  Volume2,
  BarChart2,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [compDropdownOpen, setCompDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCompOpen, setMobileCompOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: t('navbar.dashboard'), href: '/', icon: Home },
    { name: t('navbar.air'), href: '/air', icon: Wind },
    { name: t('navbar.water'), href: '/water', icon: Droplets },
    { name: t('navbar.soil'), href: '/soil', icon: MountainSnow },
    { name: t('navbar.sound'), href: '/sound', icon: Volume2 },
  ];

  const compOptions = [
    { name: t('comparison_menu.air'), href: '/comparison?type=air', icon: Wind, type: 'air' },
    { name: t('comparison_menu.water'), href: '/comparison?type=water', icon: Droplets, type: 'water' },
    { name: t('comparison_menu.soil'), href: '/comparison?type=soil', icon: MountainSnow, type: 'soil' },
    { name: t('comparison_menu.sound'), href: '/comparison?type=sound', icon: Volume2, type: 'sound' },
  ];

  const isComparisonActive = pathname.startsWith('/comparison');

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.comp-dropdown-container')) {
        setCompDropdownOpen(false);
      }
      if (!target.closest('.lang-dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setCompDropdownOpen(false);
        setMobileCompOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCompDropdownOpen(false);
    setMobileCompOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
            <div className="leading-tight">
              <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-foreground">Eco Earth</span>
              <span className="hidden sm:block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Climate Insights</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Primary">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-primary/12 border border-primary/25 rounded-full"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}

            <div className="relative comp-dropdown-container">
              <button
                onClick={() => setCompDropdownOpen((prev) => !prev)}
                aria-expanded={compDropdownOpen}
                aria-haspopup="menu"
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                  isComparisonActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isComparisonActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-primary/12 border border-primary/25 rounded-full"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>{t('comparison_menu.title')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${compDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {compDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute left-0 mt-2 min-w-52 rounded-xl border border-border/80 bg-card shadow-xl p-1.5"
                    role="menu"
                  >
                    {compOptions.map((opt) => (
                      <Link
                        key={opt.type}
                        href={opt.href}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/70"
                      >
                        <opt.icon className="w-4 h-4 text-muted-foreground" />
                        <span>{opt.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative lang-dropdown-container">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40"
              >
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{language === 'en' ? 'EN' : 'বাংলা'}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 rounded-xl border border-border/80 bg-card shadow-xl p-1.5"
                    role="menu"
                  >
                    {([
                      ['en', '🇺🇸 English'],
                      ['bn', '🇧🇩 বাংলা'],
                    ] as const).map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
                          setDropdownOpen(false);
                        }}
                        role="menuitemradio"
                        aria-checked={language === code}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          language === code ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted/70'
                        }`}
                      >
                        <span>{label}</span>
                        {language === code ? <Check className="w-3.5 h-3.5" /> : null}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground hover:border-primary/40"
              aria-label={t('navbar.theme')}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/60"
              aria-label={t('navbar.theme')}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="rounded-full border border-border bg-muted/60 px-2.5 py-1.5 text-xs font-semibold"
              aria-label={t('navbar.language')}
            >
              {language === 'en' ? 'EN' : 'বাংলা'}
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/60"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/70 bg-card/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-primary/12 border border-primary/20 text-primary'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="space-y-1">
                <button
                  onClick={() => setMobileCompOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-medium ${
                    isComparisonActive ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted/60'
                  }`}
                  aria-expanded={mobileCompOpen}
                >
                  <span className="flex items-center gap-3">
                    <BarChart2 className="w-4 h-4" />
                    {t('comparison_menu.title')}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCompOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileCompOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 pl-4 overflow-hidden"
                    >
                      {compOptions.map((opt) => (
                        <Link
                          key={opt.type}
                          href={opt.href}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        >
                          <opt.icon className="w-4 h-4" />
                          <span>{opt.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
