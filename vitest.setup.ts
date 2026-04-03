import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'

// Auto-cleanup after each test
afterEach(() => cleanup())

// ── Mock next/image ──────────────────────────────────────────────────────────
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement('img', { ...props, 'data-testid': 'next-image' }),
}))

// ── Mock next/link ───────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...rest }, children),
}))

// ── Mock next/navigation ─────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

// ── Mock next-themes ─────────────────────────────────────────────────────────
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// ── Mock framer-motion ───────────────────────────────────────────────────────
const motionCache: Record<string, React.ForwardRefExoticComponent<Record<string, unknown>>> = {}

function getMotionComponent(tag: string) {
  if (!motionCache[tag]) {
    // eslint-disable-next-line react/display-name
    motionCache[tag] = React.forwardRef<HTMLElement, Record<string, unknown>>(
      ({ children, ...props }, ref) => {
        const safe: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(props)) {
          if (
            !k.startsWith('while') &&
            !k.startsWith('animate') &&
            !k.startsWith('initial') &&
            !k.startsWith('exit') &&
            !k.startsWith('transition') &&
            !k.startsWith('variants') &&
            !k.startsWith('drag') &&
            k !== 'layout' &&
            k !== 'layoutId' &&
            k !== 'onAnimationComplete'
          ) {
            safe[k] = v
          }
        }
        return React.createElement(tag, { ...safe, ref }, children as React.ReactNode)
      },
    )
    motionCache[tag].displayName = `motion.${tag}`
  }
  return motionCache[tag]
}

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_t, prop: string) => getMotionComponent(prop) }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
}))

// ── Mock @sanity/client/stega ────────────────────────────────────────────────
vi.mock('@sanity/client/stega', () => ({
  stegaClean: (val: unknown) => val,
}))

// ── Mock motion components ───────────────────────────────────────────────────
vi.mock('@/components/motion/hover-card', () => ({
  HoverCard: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}))

vi.mock('@/components/motion/fade-up', () => ({
  FadeUp: ({ children, className }: { children: React.ReactNode; className?: string }) =>
    React.createElement('div', { className }, children),
}))

vi.mock('@/components/motion/stagger', () => ({
  Stagger: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}))

// ── Mock PortableTextRenderer ────────────────────────────────────────────────
vi.mock('@/components/shared/portable-text-renderer', () => ({
  PortableTextRenderer: ({ value }: { value: unknown }) =>
    React.createElement('div', { 'data-testid': 'portable-text' }, JSON.stringify(value)),
}))
