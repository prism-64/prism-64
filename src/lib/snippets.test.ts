import { describe, expect, it } from 'vitest'
import { buildManifest, buildSnippet } from './snippets'

const image = {
  name: 'mountain-view.png',
  mimeType: 'image/png',
  dataUrl: 'data:image/png;base64,abc123',
  size: 2048,
  width: 640,
  height: 480,
}

describe('snippet builders', () => {
  it('builds HTML with escaped alt text and dimensions', () => {
    const snippet = buildSnippet('html', image)
    expect(snippet).toContain('src="data:image/png;base64,abc123"')
    expect(snippet).toContain('alt="mountain view"')
    expect(snippet).toContain('width="640"')
    expect(snippet).toContain('height="480"')
  })

  it('builds CSS, Markdown, and JSON snippets', () => {
    expect(buildSnippet('css', image)).toContain('background-image: url("data:image/png;base64,abc123")')
    expect(buildSnippet('markdown', image)).toBe('![mountain view](data:image/png;base64,abc123)')
    expect(JSON.parse(buildSnippet('json', image))).toMatchObject({
      name: 'mountain-view.png',
      type: 'image/png',
      width: 640,
    })
  })

  it('builds a batch manifest', () => {
    const manifest = JSON.parse(buildManifest([image, { ...image, name: 'second.jpg' }]))
    expect(manifest.generator).toBe('Prism64')
    expect(manifest.count).toBe(2)
    expect(manifest.images).toHaveLength(2)
  })
})
