export class Base64Error extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Base64Error'
  }
}

export interface EncodedPayload {
  dataUrl: string
  base64: string
  mimeType: string
  size: number
}

export interface DecodedImage {
  dataUrl: string
  base64: string
  mimeType: string
  extension: string
  size: number
  bytes: Uint8Array
}

const MIME_EXTENSIONS: Record<string, string> = {
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/vnd.microsoft.icon': 'ico',
  'image/webp': 'webp',
  'image/x-icon': 'ico',
}

const EXTENSION_MIMES: Record<string, string> = {
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp',
}

const MIME_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/svg': 'image/svg+xml',
  'image/x-png': 'image/png',
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.subarray(start, end))
}

export function normalizeMimeType(mimeType: string): string {
  const normalized = mimeType.trim().toLowerCase()
  return MIME_ALIASES[normalized] ?? normalized
}

export function inferMimeTypeFromName(name: string): string {
  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  return EXTENSION_MIMES[extension] ?? ''
}

export function mimeToExtension(mimeType: string): string {
  const normalized = normalizeMimeType(mimeType)
  if (MIME_EXTENSIONS[normalized]) return MIME_EXTENSIONS[normalized]
  const subtype = normalized.split('/')[1] ?? 'bin'
  return subtype.replace('+xml', '').replace(/[^a-z0-9]/g, '') || 'bin'
}

export function bytesToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let binary = ''
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

export function normalizeBase64(value: string): string {
  const compact = value
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  if (!compact) {
    throw new Base64Error('Paste a Base64 string or data URL to begin.')
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact)) {
    throw new Base64Error(
      'This contains characters that are not valid Base64. Check the pasted value and try again.',
    )
  }

  const unpadded = compact.replace(/=+$/, '')
  if (unpadded.length % 4 === 1) {
    throw new Base64Error('This Base64 string has an invalid length. It may be incomplete.')
  }

  return unpadded + '='.repeat((4 - (unpadded.length % 4)) % 4)
}

export function base64ToBytes(base64: string): Uint8Array {
  let binary: string
  try {
    binary = atob(base64)
  } catch {
    throw new Base64Error('The Base64 data could not be decoded. It may be incomplete or corrupted.')
  }

  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export function sniffMimeType(bytes: Uint8Array): string | null {
  if (bytes.length >= 8) {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    if (png.every((byte, index) => bytes[index] === byte)) return 'image/png'
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg'
  }

  if (bytes.length >= 6) {
    const signature = ascii(bytes, 0, 6)
    if (signature === 'GIF87a' || signature === 'GIF89a') return 'image/gif'
  }

  if (bytes.length >= 12) {
    if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'image/webp'
    if (ascii(bytes, 4, 8) === 'ftyp') {
      const brand = ascii(bytes, 8, 12)
      if (brand === 'avif' || brand === 'avis') return 'image/avif'
      if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) return 'image/heic'
    }
  }

  if (bytes.length >= 2 && ascii(bytes, 0, 2) === 'BM') return 'image/bmp'

  if (
    bytes.length >= 4 &&
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0x01 &&
    bytes[3] === 0x00
  ) {
    return 'image/x-icon'
  }

  if (bytes.length >= 4) {
    const tiffLittle = bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00
    const tiffBig = bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a
    if (tiffLittle || tiffBig) return 'image/tiff'
  }

  if (bytes.length >= 4) {
    const start = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 2048))).trimStart()
    if (/<svg[\s>]/i.test(start)) return 'image/svg+xml'
  }

  return null
}

export async function encodeFile(file: File): Promise<EncodedPayload> {
  if (!file.size) {
    throw new Base64Error('This file is empty. Choose an image with content.')
  }

  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const sniffed = sniffMimeType(bytes)
  const declared = normalizeMimeType(file.type || inferMimeTypeFromName(file.name))
  const mimeType = sniffed ?? declared

  if (!mimeType || !mimeType.startsWith('image/')) {
    throw new Base64Error(
      'That file is not a recognized image. Choose a PNG, JPG, GIF, WebP, SVG, AVIF, or BMP file.',
    )
  }

  const base64 = bytesToBase64(bytes)
  return {
    dataUrl: `data:${mimeType};base64,${base64}`,
    base64,
    mimeType,
    size: bytes.byteLength,
  }
}

export function decodeBase64Input(input: string): DecodedImage {
  const trimmed = input.trim()

  if (!trimmed) {
    throw new Base64Error('Paste a Base64 string or data URL to begin.')
  }

  if (/^https?:\/\//i.test(trimmed)) {
    throw new Base64Error(
      'Remote image URLs are not supported. Paste Base64 or a data URL instead.',
    )
  }

  let declaredMime = ''
  let payload = trimmed

  if (/^data:/i.test(trimmed)) {
    const commaIndex = trimmed.indexOf(',')
    if (commaIndex === -1) {
      throw new Base64Error('This data URL is missing its comma separator.')
    }

    const metadata = trimmed.slice(5, commaIndex)
    const parts = metadata.split(';')
    declaredMime = normalizeMimeType(parts.shift() ?? '')
    const isBase64 = parts.some((part) => part.trim().toLowerCase() === 'base64')

    if (!isBase64) {
      throw new Base64Error('Only Base64-encoded data URLs are supported.')
    }

    payload = trimmed.slice(commaIndex + 1)
  }

  const normalized = normalizeBase64(payload)
  const bytes = base64ToBytes(normalized)

  if (!bytes.length) {
    throw new Base64Error('The decoded data is empty.')
  }

  const sniffed = sniffMimeType(bytes)
  const mimeType = sniffed ?? (declaredMime.startsWith('image/') ? declaredMime : '')

  if (!mimeType) {
    if (declaredMime && !declaredMime.startsWith('image/')) {
      throw new Base64Error(`This data URL declares ${declaredMime}, not an image.`)
    }
    throw new Base64Error(
      'The Base64 data does not contain a recognized image format. Try a PNG, JPG, GIF, WebP, SVG, AVIF, or BMP.',
    )
  }

  return {
    dataUrl: `data:${mimeType};base64,${normalized}`,
    base64: normalized,
    mimeType,
    extension: mimeToExtension(mimeType),
    size: bytes.byteLength,
    bytes,
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  const precision = index === 0 || value >= 10 ? 0 : 1
  return `${value.toFixed(precision)} ${units[index]}`
}

export function formatDimensions(width?: number, height?: number): string {
  if (!width || !height) return 'Unknown'
  return `${width} × ${height}`
}

export function getEncodedOverhead(originalSize: number, base64Length: number): number {
  if (!originalSize) return 0
  return Math.max(0, Math.round((base64Length / originalSize - 1) * 100))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
