export type SnippetKind = 'html' | 'css' | 'markdown' | 'json'

export interface SnippetImage {
  name: string
  mimeType: string
  dataUrl: string
  size: number
  width?: number
  height?: number
}

export interface ManifestImage {
  name: string
  mimeType: string
  size: number
  width?: number
  height?: number
  dataUrl: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function altText(name: string): string {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Image'
}

export function buildSnippet(kind: SnippetKind, image: SnippetImage): string {
  const alt = altText(image.name)

  switch (kind) {
    case 'html': {
      const dimensions = image.width && image.height ? `\n  width="${image.width}"\n  height="${image.height}"` : ''
      return `<img\n  src="${image.dataUrl}"\n  alt="${escapeHtml(alt)}"${dimensions}\n/>`
    }
    case 'css':
      return `.image {\n  background-image: url("${image.dataUrl}");\n  background-size: cover;\n  background-position: center;\n}`
    case 'markdown':
      return `![${alt.replace(/[[\]]/g, '')}](${image.dataUrl})`
    case 'json':
      return JSON.stringify(
        {
          name: image.name,
          type: image.mimeType,
          size: image.size,
          width: image.width,
          height: image.height,
          dataUrl: image.dataUrl,
        },
        null,
        2,
      )
  }
}

export function buildManifest(images: SnippetImage[]): string {
  return JSON.stringify(
    {
      generator: 'Prism64',
      generatedAt: new Date().toISOString(),
      count: images.length,
      images: images.map<ManifestImage>((image) => ({
        name: image.name,
        mimeType: image.mimeType,
        size: image.size,
        width: image.width,
        height: image.height,
        dataUrl: image.dataUrl,
      })),
    },
    null,
    2,
  )
}
