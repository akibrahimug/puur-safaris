"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { stegaClean } from "@sanity/client/stega";
import { Menu, X, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { SiteSettings, NavLink } from "@/lib/types";

const defaultNavLinks: NavLink[] = [
  { href: "/safari-reizen", label: "Safari Reizen" },
  { href: "/bestemmingen", label: "Bestemmingen" },
  { href: "/blog", label: "Blog" },
  { href: "/over-ons", label: "Over Ons" },
  { href: "/faq", label: "FAQ" },
];

interface HeaderProps {
  settings?: SiteSettings | null;
}

export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navLinks = settings?.mainNavigation?.length ? settings.mainNavigation : defaultNavLinks;

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
          <Link href="/" className="flex items-center gap-2">
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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={stegaClean(link.href)}
                href={stegaClean(link.href)}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${
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
          <div className="hidden lg:flex items-center gap-3">
            {settings?.phone && (
              <a
                href={`tel:${stegaClean(settings.phone)?.replace(/\s/g, "")}`}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
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
              href={settings?.headerCtaLink ?? "/eigen-reisschema"}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                scrolled && !isDark
                  ? "border-stone-900/20 text-stone-900 hover:bg-stone-900 hover:text-white"
                  : "border-white/25 text-white hover:bg-white/10"
              }`}
            >
              {settings?.headerCtaLabel ?? 'Eigen Reisschema'}
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
                  href={settings?.headerCtaLink ?? "/eigen-reisschema"}
                  className={`block w-full rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-gold text-white hover:bg-gold-dark"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {settings?.headerCtaLabel ?? 'Eigen Reisschema'}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
