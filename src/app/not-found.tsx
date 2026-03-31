import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-gold">404</p>
      <h1 className="font-serif text-3xl font-bold text-stone-900">Pagina niet gevonden</h1>
      <p className="max-w-sm text-stone-600">
        De pagina die u zoekt bestaat niet of is verplaatst.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Terug naar home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/safari-reizen">Bekijk reizen</Link>
        </Button>
      </div>
    </div>
  )
}
