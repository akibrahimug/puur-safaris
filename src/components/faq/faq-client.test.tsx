import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FaqClient } from './faq-client'

const faqData = {
  general: [
    {
      _id: '1',
      question: 'Wat is een safari?',
      answer: [{ _type: 'block', children: [{ text: 'Een safari is...' }] }],
      category: 'general',
    },
    {
      _id: '2',
      question: 'Hoeveel kost het?',
      answer: [{ _type: 'block', children: [{ text: 'Prijzen variëren' }] }],
      category: 'general',
    },
  ],
  booking: [
    {
      _id: '3',
      question: 'Hoe boek ik?',
      answer: [{ _type: 'block', children: [{ text: 'Via de website' }] }],
      category: 'booking',
    },
  ],
}

describe('FaqClient', () => {
  it('renders all category buttons', () => {
    render(<FaqClient groupedFaqs={faqData} />)
    // 'general' maps to 'Algemeen', 'booking' maps to 'Boeking & Betaling', plus 'Alles Bekijken'
    expect(screen.getByRole('button', { name: /Alles Bekijken/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Algemeen/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Boeking & Betaling/i })).toBeInTheDocument()
  })

  it('renders all questions', () => {
    render(<FaqClient groupedFaqs={faqData} />)
    expect(screen.getByText('Wat is een safari?')).toBeInTheDocument()
    expect(screen.getByText('Hoeveel kost het?')).toBeInTheDocument()
    expect(screen.getByText('Hoe boek ik?')).toBeInTheDocument()
  })

  it('clicking a question toggles its answer', async () => {
    const user = userEvent.setup()
    render(<FaqClient groupedFaqs={faqData} />)

    // Answer should not be visible initially
    expect(screen.queryAllByTestId('portable-text')).toHaveLength(0)

    // Click to open
    await user.click(screen.getByText('Wat is een safari?'))
    expect(screen.getByTestId('portable-text')).toBeInTheDocument()

    // Click again to close
    await user.click(screen.getByText('Wat is een safari?'))
    expect(screen.queryAllByTestId('portable-text')).toHaveLength(0)
  })

  it('search filters questions by text', async () => {
    const user = userEvent.setup()
    render(<FaqClient groupedFaqs={faqData} />)

    const searchInput = screen.getByPlaceholderText('Zoek een vraag...')
    await user.type(searchInput, 'boek')

    // Only 'Hoe boek ik?' should remain visible
    expect(screen.getByText('Hoe boek ik?')).toBeInTheDocument()
    expect(screen.queryByText('Wat is een safari?')).not.toBeInTheDocument()
    expect(screen.queryByText('Hoeveel kost het?')).not.toBeInTheDocument()
  })

  it('category filter shows only matching questions', async () => {
    const user = userEvent.setup()
    render(<FaqClient groupedFaqs={faqData} />)

    // Click the 'booking' category button
    await user.click(screen.getByRole('button', { name: /Boeking & Betaling/i }))

    expect(screen.getByText('Hoe boek ik?')).toBeInTheDocument()
    expect(screen.queryByText('Wat is een safari?')).not.toBeInTheDocument()
    expect(screen.queryByText('Hoeveel kost het?')).not.toBeInTheDocument()
  })

  it('empty search shows "Geen resultaten" message', async () => {
    const user = userEvent.setup()
    render(<FaqClient groupedFaqs={faqData} />)

    const searchInput = screen.getByPlaceholderText('Zoek een vraag...')
    await user.type(searchInput, 'xyznonexistent')

    expect(screen.getByText(/Geen resultaten/)).toBeInTheDocument()
  })
})
