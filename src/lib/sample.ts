import { bytesToBase64 } from './base64'

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#070b16"/>
      <stop offset="0.55" stop-color="#0b1224"/>
      <stop offset="1" stop-color="#11102a"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#67e8f9"/>
      <stop offset="0.5" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#c084fc"/>
    </linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#67e8f9" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0.35"/>
    </linearGradient>
    <radialGradient id="glow">
      <stop offset="0" stop-color="#67e8f9" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#67e8f9" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#grid)"/>
  <circle cx="250" cy="180" r="220" fill="#22d3ee" opacity="0.12" filter="url(#blur)"/>
  <circle cx="980" cy="620" r="260" fill="#8b5cf6" opacity="0.16" filter="url(#blur)"/>
  <g opacity="0.5" stroke="#67e8f9" fill="none">
    <ellipse cx="600" cy="400" rx="360" ry="150" stroke-opacity="0.18" stroke-dasharray="4 12"/>
    <ellipse cx="600" cy="400" rx="270" ry="270" stroke-opacity="0.1" stroke-dasharray="2 14"/>
  </g>
  <g transform="translate(600 400)">
    <circle r="190" fill="url(#glow)" filter="url(#soft)"/>
    <path d="M0 -190 L165 -95 L165 95 L0 190 L-165 95 L-165 -95 Z" fill="#0b1224" stroke="url(#beam)" stroke-width="2"/>
    <path d="M0 -190 L0 0 L165 95 L165 -95 Z" fill="url(#face)" opacity="0.22"/>
    <path d="M0 -190 L-165 -95 L-165 95 L0 0 Z" fill="#67e8f9" opacity="0.08"/>
    <path d="M0 0 L165 95 L0 190 L-165 95 Z" fill="#8b5cf6" opacity="0.12"/>
    <path d="M0 -190 L0 0 M0 0 L165 95 M0 0 L-165 95 M0 0 L0 190" stroke="#e0f2fe" stroke-opacity="0.35" stroke-width="1.5"/>
    <circle r="7" fill="#e0f2fe"/>
    <circle r="18" fill="none" stroke="#67e8f9" stroke-opacity="0.5"/>
  </g>
  <g font-family="Manrope, Arial, sans-serif" fill="#f8fbff">
    <text x="80" y="100" font-size="18" letter-spacing="6" fill="#67e8f9">PRISM / 64</text>
    <text x="80" y="150" font-size="42" font-weight="700" letter-spacing="-1">Image in. Code out.</text>
    <text x="80" y="196" font-size="18" fill="#94a3b8">A sample image for your first conversion.</text>
  </g>
  <g font-family="'JetBrains Mono', monospace" font-size="13" fill="#94a3b8">
    <text x="80" y="700">data:image/svg+xml;base64,</text>
    <text x="80" y="724" fill="#67e8f9">iVBORw0KGgoAAAANSUhEUg...</text>
    <text x="920" y="700" fill="#c084fc">ENCODE</text>
    <text x="920" y="724">DECODE</text>
  </g>
  <g fill="none" stroke="url(#beam)" stroke-width="2" opacity="0.7">
    <path d="M250 400 C360 400 390 400 435 400" stroke-dasharray="6 10"/>
    <path d="M765 400 C820 400 850 400 950 400" stroke-dasharray="6 10"/>
  </g>
  <g fill="#67e8f9">
    <circle cx="250" cy="400" r="5"/>
    <circle cx="950" cy="400" r="5"/>
  </g>
</svg>`

export function createSampleFile(): File {
  return new File([SAMPLE_SVG], 'prism-sample.svg', { type: 'image/svg+xml' })
}

export function createSampleDataUrl(): string {
  const base64 = bytesToBase64(new TextEncoder().encode(SAMPLE_SVG))
  return `data:image/svg+xml;base64,${base64}`
}
