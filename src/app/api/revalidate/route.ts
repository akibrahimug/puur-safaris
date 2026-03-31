import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Onbevoegde toegang' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { _type } = body as { _type?: string }

    if (_type === 'safari') {
      revalidatePath('/safari-reizen', 'page')
      revalidatePath('/safari-reizen/[slug]', 'page')
      revalidatePath('/', 'page')
    } else if (_type === 'bestemming') {
      revalidatePath('/bestemmingen', 'page')
      revalidatePath('/bestemmingen/[slug]', 'page')
      revalidatePath('/', 'page')
    } else if (_type === 'blogBericht') {
      revalidatePath('/blog', 'page')
      revalidatePath('/blog/[slug]', 'page')
    } else if (_type === 'getuigenis') {
      revalidatePath('/', 'page')
    } else if (_type === 'veelgesteldeVraag') {
      revalidatePath('/faq', 'page')
    } else if (_type === 'siteInstellingen') {
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type: _type })
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })
  }
}
