"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { stegaClean } from "@sanity/client/stega";
import { Menu, X, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { localePath, cmsPathToLocale } from "@/i18n/routes";
import { sanityImageUrl } from "@/sanity/image";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/lib/types";

// Navigation is CMS-driven. This is a minimal fallback only used if settings fail to load.

// Localized chrome strings (aria-labels, mostly). The site layout passes
// `dict.header` here. Kept as a prop instead of read inside the component
// because Header is a `'use client'` component and can't reach into the
// server-side dictionary directly. Dutch fallbacks live at every consumer
// in case the prop isn't threaded through.
interface HeaderLabels {
  menuLabel?: string;
  menuCloseLabel?: string;
  themeToLightLabel?: string;
  themeToDarkLabel?: string;
  languageLabel?: string;
}

interface HeaderProps {
  settings?: SiteSettings | null;
  locale?: string;
  labels?: HeaderLabels;
}

export function Header({ settings, locale = "nl", labels }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = mounted ? theme === "dark" : false;
  const loc = locale as Locale
  // CMS stores Dutch paths — map them to the correct locale paths
  const navLinks = settings?.mainNavigation?.length
    ? settings.mainNavigation.map((link) => ({
        ...link,
        href: `/${locale}${cmsPathToLocale(stegaClean(link.href), loc)}`,
      }))
    : [];

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape; lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const scrolledClass = scrolled
    ? isDark
      ? "bg-ink shadow-[0_1px_0_rgba(255,255,255,0.05)]"
      : "bg-[#eef5f1] shadow-[0_1px_0_rgba(29,76,47,0.1)]"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolledClass}`}
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {settings?.logo?.asset?.url ? (
              <div
                className={`rounded-lg px-2 py-1 transition-colors duration-300 ${
                  scrolled ? "bg-transparent" : "backdrop-blur-sm"
                }`}
              >
                <Image
                  src={sanityImageUrl(settings.logo, 360)}
                  alt={settings.logo.alt ?? settings.siteName}
                  width={120}
                  height={40}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </div>
            ) : (
              <span
                className={`font-serif text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled && !isDark ? "text-stone-900" : "text-white"
                }`}
              >
                {settings?.siteName ?? 'Puur Uganda Reizen'}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={stegaClean(link.href)}
                href={stegaClean(link.href)}
                className={`relative text-xs xl:text-sm font-medium tracking-wide transition-colors duration-300 group whitespace-nowrap ${
                  scrolled && !isDark
                    ? "text-stone-600 hover:text-stone-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {stegaClean(link.label)}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {settings?.phone && (
              <a
                href={`tel:${stegaClean(settings.phone)?.replace(/\s/g, "")}`}
                className={`flex items-center gap-1.5 text-xs xl:text-sm font-medium transition-colors duration-300 ${
                  scrolled && !isDark
                    ? "text-stone-600 hover:text-stone-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {settings.phone}
              </a>
            )}
            <LanguageToggle locale={locale} label={labels?.languageLabel} />
            <ThemeToggle scrolled={scrolled} labels={{ toLight: labels?.themeToLightLabel, toDark: labels?.themeToDarkLabel }} />
            <Link
              href={settings?.headerCtaLink ? `/${locale}${cmsPathToLocale(stegaClean(settings.headerCtaLink), loc)}` : localePath(loc, 'customItinerary')}
              className={`rounded-full border px-3 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                scrolled && !isDark
                  ? "border-stone-900/20 text-stone-900 hover:bg-stone-900 hover:text-white"
                  : "border-white/25 text-white hover:bg-white/10"
              }`}
            >
              {stegaClean(settings?.headerCtaLabel) ?? 'Eigen Reisschema'}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle locale={locale} label={labels?.languageLabel} />
            <ThemeToggle scrolled={scrolled} labels={{ toLight: labels?.themeToLightLabel, toDark: labels?.themeToDarkLabel }} />
            <button
              type="button"
              className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg transition-colors touch-manipulation ${
                scrolled && !isDark ? "text-stone-700" : "text-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? (labels?.menuCloseLabel ?? 'Menu sluiten') : (labels?.menuLabel ?? 'Menu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/*
        Mobile nav — two invariants worth preserving (we previously violated
        both and the menu looked broken):
          1. The panel uses a SOLID background (`bg-ink` / `bg-[#f7faf8]`),
             not the `glass-*` classes. Translucent + auto-height let the
             page content show through under the menu items.
          2. The panel is FIXED full-viewport below the header
             (`top-16 bottom-0`), not `height: auto`. Auto-height made the
             menu shorter than the page and the hero peeked out under it.
        The backdrop dim is `bg-black/55` — anything weaker doesn't visually
        separate the menu from the hero behind it.
      */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — click to dismiss */}
            <motion.button
              type="button"
              aria-label={labels?.menuCloseLabel ?? 'Menu sluiten'}
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-16 z-40 bg-black/55 backdrop-blur-sm cursor-default"
            />
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 overflow-hidden border-t pb-[env(safe-area-inset-bottom)] ${
                isDark
                  ? "bg-ink border-white/6"
                  : "bg-[#f7faf8] border-stone-200/80"
              }`}
            >
              <nav className="flex flex-col px-6 py-4 gap-1 h-full overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={stegaClean(link.href)}
                    href={stegaClean(link.href)}
                    className={`flex items-center min-h-11 rounded-lg px-3 py-3 text-base font-medium transition-colors touch-manipulation ${
                      isDark
                        ? "text-white/70 hover:bg-white/6 hover:text-white active:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {stegaClean(link.label)}
                  </Link>
                ))}
                {settings?.phone && (
                  <a
                    href={`tel:${stegaClean(settings.phone)?.replace(/\s/g, "")}`}
                    className={`flex items-center gap-2 min-h-11 rounded-lg px-3 py-3 text-base font-medium transition-colors touch-manipulation ${
                      isDark
                        ? "text-white/70 hover:bg-white/6 hover:text-white"
                        : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {settings.phone}
                  </a>
                )}
                <div
                  className={`mt-3 pt-3 border-t ${isDark ? "border-white/8" : "border-stone-200"}`}
                >
                  <Link
                    href={settings?.headerCtaLink ? `/${locale}${cmsPathToLocale(stegaClean(settings.headerCtaLink), loc)}` : localePath(loc, 'customItinerary')}
                    className={`flex items-center justify-center w-full min-h-11 rounded-full px-5 py-3 text-center text-sm font-medium transition-colors touch-manipulation ${
                      isDark
                        ? "bg-gold text-white hover:bg-gold-dark"
                        : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {stegaClean(settings?.headerCtaLabel) ?? 'Eigen Reisschema'}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
