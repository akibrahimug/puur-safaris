/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { POST } from './route'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

function makeReq(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'super-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 401 when the x-revalidate-secret header is missing', async () => {
    const res = await POST(makeReq({ _type: 'trip' }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBeTruthy()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns 401 when the secret does not match', async () => {
    const res = await POST(
      makeReq({ _type: 'trip' }, { 'x-revalidate-secret': 'wrong' }),
    )
    expect(res.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('revalidates trip paths when _type is trip', async () => {
    const res = await POST(
      makeReq({ _type: 'trip' }, { 'x-revalidate-secret': 'super-secret' }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ revalidated: true, type: 'trip' })
    expect(revalidatePath).toHaveBeenCalledWith('/safaris', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/safaris/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page')
  })

  it('revalidates destination paths when _type is destination', async () => {
    await POST(
      makeReq(
        { _type: 'destination' },
        { 'x-revalidate-secret': 'super-secret' },
      ),
    )
    expect(revalidatePath).toHaveBeenCalledWith('/destinations', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/destinations/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page')
  })

  it('revalidates blog paths when _type is blogPost', async () => {
    await POST(
      makeReq({ _type: 'blogPost' }, { 'x-revalidate-secret': 'super-secret' }),
    )
    expect(revalidatePath).toHaveBeenCalledWith('/blog', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/[slug]', 'page')
  })

  it('revalidates the layout when _type is siteSettings', async () => {
    await POST(
      makeReq(
        { _type: 'siteSettings' },
        { 'x-revalidate-secret': 'super-secret' },
      ),
    )
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('returns 200 with no revalidation calls for an unknown _type', async () => {
    const res = await POST(
      makeReq(
        { _type: 'somethingUnknown' },
        { 'x-revalidate-secret': 'super-secret' },
      ),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ revalidated: true, type: 'somethingUnknown' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns 400 when the body is malformed JSON', async () => {
    const req = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': 'super-secret',
      },
      body: '{not-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
