"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { stegaClean } from "@sanity/client/stega";
import { Menu, X, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { localePath } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { SiteSettings, NavLink } from "@/lib/types";

const defaultNavLinksNl: NavLink[] = [
  { href: "/nl/safari-reizen", label: "Safari Reizen" },
  { href: "/nl/bestemmingen", label: "Bestemmingen" },
  { href: "/nl/blog", label: "Blog" },
  { href: "/nl/over-ons", label: "Over Ons" },
  { href: "/nl/faq", label: "FAQ" },
  { href: "/nl/contact", label: "Contact" },
];

// Note: Dutch nav links use Dutch URLs which rewrite to English folder paths via next.config.ts

const defaultNavLinksEn: NavLink[] = [
  { href: "/en/safaris", label: "Safaris" },
  { href: "/en/destinations", label: "Destinations" },
  { href: "/en/blog", label: "Blog" },
  { href: "/en/about", label: "About Us" },
  { href: "/en/faq", label: "FAQ" },
  { href: "/en/contact", label: "Contact" },
];

interface HeaderProps {
  settings?: SiteSettings | null;
  locale?: string;
}

export function Header({ settings, locale = "nl" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = mounted ? theme === "dark" : false;
  const defaultNavLinks = locale === "en" ? defaultNavLinksEn : defaultNavLinksNl;
  // Use CMS nav only when it matches the current locale (Dutch nav shouldn't show on /en)
  const cmsNavMatchesLocale = settings?.mainNavigation?.length && locale === "nl";
  const navLinks = cmsNavMatchesLocale
    ? settings!.mainNavigation!.map((link) => ({
        ...link,
        href: `/${locale}${stegaClean(link.href)}`,
      }))
    : defaultNavLinks;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                  src={settings.logo.asset.url}
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
                Puur<span className="text-gold"> Safaris</span>
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
                {link.label}
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
            <ThemeToggle scrolled={scrolled} />
            <Link
              href={settings?.headerCtaLink ? `/${locale}${stegaClean(settings.headerCtaLink)}` : localePath(locale as Locale, 'customItinerary')}
              className={`rounded-full border px-3 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                scrolled && !isDark
                  ? "border-stone-900/20 text-stone-900 hover:bg-stone-900 hover:text-white"
                  : "border-white/25 text-white hover:bg-white/10"
              }`}
            >
              {settings?.headerCtaLabel ?? (locale === 'en' ? 'Custom Itinerary' : 'Eigen Reisschema')}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle scrolled={scrolled} />
            <button
              className={`p-2 rounded-lg transition-colors ${
                scrolled && !isDark ? "text-stone-700" : "text-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:hidden overflow-hidden border-t ${
              isDark
                ? "glass-dark border-white/6"
                : "glass-light border-stone-200/60"
            }`}
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={stegaClean(link.href)}
                  href={stegaClean(link.href)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-white/70 hover:bg-white/6 hover:text-white"
                      : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div
                className={`mt-3 pt-3 border-t ${isDark ? "border-white/8" : "border-stone-200"}`}
              >
                <Link
                  href={settings?.headerCtaLink ? `/${locale}${stegaClean(settings.headerCtaLink)}` : localePath(locale as Locale, 'customItinerary')}
                  className={`block w-full rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-gold text-white hover:bg-gold-dark"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {settings?.headerCtaLabel ?? (locale === 'en' ? 'Custom Itinerary' : 'Eigen Reisschema')}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
