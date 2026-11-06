export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = text
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      fallback.style.pointerEvents = 'none'
      document.body.append(fallback)
      fallback.select()
      const copied = document.execCommand('copy')
      fallback.remove()
      if (copied) return
      throw new Error('Copying was blocked by your browser. Select the text and copy it manually.')
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.append(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  textarea.remove()

  if (!copied) {
    throw new Error('Copying was blocked by your browser. Select the text and copy it manually.')
  }
}
