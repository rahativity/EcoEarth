'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Globe, Check, Menu, X, Home, Wind, Droplets, MountainSnow, Volume2, BarChart2, ChevronDown } from 'lucide-react';
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
    };
    if (compDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [compDropdownOpen]);

  // Auto-close menu items on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setCompDropdownOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-2 shrink-0 group focus:outline-none">
            <Logo className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Eco Earth
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {/* Under-pill dynamic slider animation using framer-motion */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}

            {/* Comparison Dropdown (Desktop) */}
            <div className="relative comp-dropdown-container">
              <button
                onClick={() => setCompDropdownOpen(!compDropdownOpen)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none flex items-center space-x-1.5 ${
                  isComparisonActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isComparisonActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>{t('comparison_menu.title')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${compDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {compDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-48 bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="py-2 px-1.5 space-y-0.5">
                      {compOptions.map((opt) => (
                        <Link
                          key={opt.type}
                          href={opt.href}
                          onClick={() => setCompDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-muted text-foreground transition-colors duration-200"
                        >
                          <opt.icon className="w-4 h-4 text-muted-foreground" />
                          <span>{opt.name}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Utilities (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Language Switcher Toggle */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted border border-border hover:border-primary/50 transition-all duration-300 text-xs font-bold text-foreground focus:outline-none"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{language === 'en' ? 'EN 🇺🇸' : 'বাংলা 🇧🇩'}</span>
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-44 bg-card/90 backdrop-blur-lg border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="py-1.5">
                        <button
                          onClick={() => {
                            setLanguage('en');
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-muted text-foreground ${
                            language === 'en' ? 'font-bold text-primary bg-primary/5' : ''
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="mr-2">🇺🇸</span> English (EN)
                          </span>
                          {language === 'en' && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                        <button
                          onClick={() => {
                            setLanguage('bn');
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-muted text-foreground ${
                            language === 'bn' ? 'font-bold text-primary bg-primary/5' : ''
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="mr-2">🇧🇩</span> বাংলা (BN)
                          </span>
                          {language === 'bn' && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-1.5 w-12 h-7 bg-muted rounded-full border border-border hover:border-primary/50 transition-all duration-300 focus:outline-none"
              aria-label="Toggle Theme"
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                animate={{ x: theme === 'dark' ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 550, damping: 28 }}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <Sun className="w-3 h-3 text-primary-foreground" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Hamburger Menu Icon (Mobile/Tablet) */}
          <div className="flex lg:hidden items-center space-x-3">
            
            {/* Quick Mobile Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-muted/60 border border-border rounded-full hover:bg-muted focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            </button>

            {/* Quick Mobile Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 bg-muted/60 border border-border rounded-full text-xs font-bold text-foreground focus:outline-none"
            >
              {language === 'en' ? '🇺🇸 EN' : '🇧🇩 বাংলা'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-muted/60 border border-border hover:bg-muted focus:outline-none text-foreground"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-card/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Comparison Accordion Trigger */}
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => setMobileCompOpen(!mobileCompOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none ${
                    isComparisonActive 
                      ? 'bg-primary/5 text-primary border border-primary/10' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <BarChart2 className="w-4 h-4" />
                    <span>{t('comparison_menu.title')}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileCompOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileCompOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-6 border-l-2 border-border/60 ml-6 space-y-1 overflow-hidden"
                    >
                      {compOptions.map((opt) => (
                        <Link
                          key={opt.type}
                          href={opt.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileCompOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-muted/30 transition-all duration-200 text-muted-foreground hover:text-foreground"
                        >
                          <opt.icon className="w-3.5 h-3.5 text-muted-foreground" />
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
