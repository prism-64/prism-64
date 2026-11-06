import { describe, expect, it } from 'vitest'
import {
  Base64Error,
  bytesToBase64,
  decodeBase64Input,
  formatBytes,
  getEncodedOverhead,
  normalizeBase64,
  sniffMimeType,
} from './base64'

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII='

describe('base64 utilities', () => {
  it('encodes bytes to Base64', () => {
    expect(bytesToBase64(new TextEncoder().encode('hello'))).toBe('aGVsbG8=')
  })

  it('normalizes whitespace, URL-safe characters, and missing padding', () => {
    expect(normalizeBase64('aGVs bG8')).toBe('aGVsbG8=')
    expect(normalizeBase64('aGVsbG8')).toBe('aGVsbG8=')
    expect(normalizeBase64('aGVsbG8_')).toBe('aGVsbG8/')
  })

  it('decodes a raw PNG and detects its MIME type', () => {
    const decoded = decodeBase64Input(PNG_BASE64)
    expect(decoded.mimeType).toBe('image/png')
    expect(decoded.extension).toBe('png')
    expect(decoded.size).toBeGreaterThan(0)
    expect(decoded.dataUrl).toBe(`data:image/png;base64,${PNG_BASE64}`)
  })

  it('decodes a complete data URL with whitespace', () => {
    const decoded = decodeBase64Input(`  data:image/png;base64,${PNG_BASE64}\n`)
    expect(decoded.mimeType).toBe('image/png')
    expect(decoded.extension).toBe('png')
  })

  it('rejects remote URLs', () => {
    expect(() => decodeBase64Input('https://example.com/image.png')).toThrow(Base64Error)
    expect(() => decodeBase64Input('https://example.com/image.png')).toThrow(/Remote image URLs/)
  })

  it('rejects invalid characters', () => {
    expect(() => decodeBase64Input('not base64!')).toThrow(/not valid Base64/)
  })

  it('rejects non-Base64 data URLs', () => {
    expect(() => decodeBase64Input('data:image/svg+xml,<svg></svg>')).toThrow(/Only Base64/)
  })

  it('rejects non-image data URLs', () => {
    expect(() => decodeBase64Input('data:text/plain;base64,aGVsbG8=')).toThrow(/not an image/)
  })

  it('sniffs common image signatures', () => {
    expect(sniffMimeType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg')
    expect(sniffMimeType(new TextEncoder().encode('GIF89a'))).toBe('image/gif')
    expect(sniffMimeType(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe(
      'image/svg+xml',
    )
  })

  it('formats byte sizes and overhead', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
    expect(getEncodedOverhead(300, 400)).toBe(33)
  })
})
