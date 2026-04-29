import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * The cache module hardcodes its directory to `process.cwd() + '/.translations'`.
 * To avoid polluting the repo we point cwd at a fresh temp dir before each test
 * (and restore it afterwards). Because the cache module captures CACHE_DIR at
 * import time, we use vi.resetModules() + a dynamic import inside each test to
 * pick up the new cwd.
 */
let dir: string
let originalCwd: string

beforeEach(() => {
  originalCwd = process.cwd()
  dir = mkdtempSync(join(tmpdir(), 'puur-cache-'))
  process.chdir(dir)
  vi.resetModules()
})

afterEach(() => {
  process.chdir(originalCwd)
  rmSync(dir, { recursive: true, force: true })
})

describe('translation cache — round-trip', () => {
  it('writes then reads back the same value', async () => {
    const { setCache, getCached } = await import('./cache')
    const data = { title: 'Translated', summary: 'Done' }
    await setCache('doc-1', 'en', 'rev-1', data)
    const result = await getCached('doc-1', 'en', 'rev-1')
    expect(result).toEqual(data)
  })

  it('creates the .translations directory on first write', async () => {
    const { setCache } = await import('./cache')
    expect(existsSync(join(dir, '.translations'))).toBe(false)
    await setCache('doc-1', 'en', 'rev-1', { title: 'x' })
    expect(existsSync(join(dir, '.translations'))).toBe(true)
  })
})

describe('translation cache — miss returns null', () => {
  it('returns null when no cache file exists', async () => {
    const { getCached } = await import('./cache')
    const result = await getCached('does-not-exist', 'en', 'rev-1')
    expect(result).toBeNull()
  })

  it('does not throw on missing entry', async () => {
    const { getCached } = await import('./cache')
    await expect(getCached('missing', 'en', 'r')).resolves.toBeNull()
  })

  it('returns null for a corrupt JSON file', async () => {
    const { setCache, getCached } = await import('./cache')
    // Force the cache directory to exist
    await setCache('seed', 'en', 'r0', { x: 1 })
    // Now corrupt a file we know how the key is computed for
    const { writeFileSync } = await import('node:fs')
    // Locate the seed file and corrupt it
    const { readdirSync } = await import('node:fs')
    const files = readdirSync(join(dir, '.translations'))
    expect(files.length).toBeGreaterThan(0)
    writeFileSync(join(dir, '.translations', files[0]), '{not valid json', 'utf-8')
    const result = await getCached('seed', 'en', 'r0')
    expect(result).toBeNull()
  })
})

describe('translation cache — staleness via _rev', () => {
  it('returns null when sourceRev no longer matches', async () => {
    const { setCache, getCached } = await import('./cache')
    await setCache('doc-1', 'en', 'rev-1', { title: 'a' })
    // Asking with a different rev → stale → miss
    const result = await getCached('doc-1', 'en', 'rev-2')
    expect(result).toBeNull()
  })
})

describe('translation cache — key isolation', () => {
  it('different docId entries do not collide', async () => {
    const { setCache, getCached } = await import('./cache')
    await setCache('doc-A', 'en', 'r1', { v: 'A' })
    await setCache('doc-B', 'en', 'r1', { v: 'B' })
    expect(await getCached('doc-A', 'en', 'r1')).toEqual({ v: 'A' })
    expect(await getCached('doc-B', 'en', 'r1')).toEqual({ v: 'B' })
  })

  it('different targetLang entries do not collide', async () => {
    const { setCache, getCached } = await import('./cache')
    await setCache('doc-1', 'en', 'r1', { v: 'EN' })
    await setCache('doc-1', 'de', 'r1', { v: 'DE' })
    expect(await getCached('doc-1', 'en', 'r1')).toEqual({ v: 'EN' })
    expect(await getCached('doc-1', 'de', 'r1')).toEqual({ v: 'DE' })
  })

  it('handles document IDs with filesystem-unfriendly characters', async () => {
    const { setCache, getCached } = await import('./cache')
    // Sanity IDs use dots and may contain slashes (drafts.foo.bar)
    await setCache('drafts.foo.bar', 'en', 'r1', { v: 'X' })
    expect(await getCached('drafts.foo.bar', 'en', 'r1')).toEqual({ v: 'X' })
  })

  it('cache filename includes TRANSLATOR_VERSION so older versions are invalidated', async () => {
    // The contract from CLAUDE.md: bumping TRANSLATOR_VERSION invalidates cache.
    // We can verify this indirectly by checking the cache file name.
    const { setCache } = await import('./cache')
    const { TRANSLATOR_VERSION } = await import('./glossary')
    await setCache('doc-version-test', 'en', 'r1', { v: 'X' })
    const { readdirSync } = await import('node:fs')
    const files = readdirSync(join(dir, '.translations'))
    const match = files.find((f) => f.startsWith('doc-version-test_en_v'))
    expect(match).toBeDefined()
    expect(match).toContain(`v${TRANSLATOR_VERSION}`)
  })
})
