import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./lib/image', () => ({
  loadImageDimensions: vi.fn().mockResolvedValue({ width: 1200, height: 800 }),
}))

describe('Prism64 app', () => {
  it('renders the hero and encode workspace', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /images in/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /encode/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument()
  })

  it('encodes the bundled sample image', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /try a sample/i }))

    expect(await screen.findByRole('button', { name: /copy data url/i })).toBeInTheDocument()
    expect(screen.getAllByText('prism-sample.svg').length).toBeGreaterThan(0)
    expect(screen.getByText('1200 × 800')).toBeInTheDocument()
  })


  it('keeps the encode workspace when switching tabs', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /try a sample/i }))
    await screen.findByRole('button', { name: /copy data url/i })
    await user.click(screen.getByRole('tab', { name: /decode/i }))
    await user.click(screen.getByRole('tab', { name: /encode/i }))

    expect(screen.getByRole('button', { name: /copy data url/i })).toBeInTheDocument()
    expect(screen.getAllByText('prism-sample.svg').length).toBeGreaterThan(0)
  })

  it('decodes the bundled sample data URL', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: /decode/i }))
    await user.click(screen.getByRole('button', { name: /try the sample/i }))

    expect(await screen.findByText('Reconstructed image')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download image/i })).toBeInTheDocument()
    expect(screen.getByText('1200 × 800')).toBeInTheDocument()
  })

  it('shows a helpful error for malformed Base64', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: /decode/i }))
    await user.type(screen.getByLabelText(/base64 string or data url/i), 'not base64!')
    await user.click(screen.getByRole('button', { name: /decode image/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/not valid Base64/i)
  })
})
