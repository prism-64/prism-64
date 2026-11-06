import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ClipboardPaste,
  Copy,
  Download,
  Image as ImageIcon,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  decodeBase64Input,
  formatBytes,
  formatDimensions,
  getErrorMessage,
  type DecodedImage,
} from '../lib/base64'
import { copyText } from '../lib/clipboard'
import { downloadDataUrl } from '../lib/download'
import { loadImageDimensions } from '../lib/image'
import { createSampleDataUrl } from '../lib/sample'
import type { ToastTone } from '../types'
import { CodeBlock } from './CodeBlock'

interface DecodePanelProps {
  notify: (message: string, tone?: ToastTone) => void
}

interface DecodedResult extends DecodedImage {
  width: number
  height: number
}

export function DecodePanel({ notify }: DecodePanelProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<DecodedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDecoding, setIsDecoding] = useState(false)
  const requestId = useRef(0)

  const decodeValue = useCallback(async (value: string) => {
    const currentRequest = requestId.current + 1
    requestId.current = currentRequest
    setError(null)
    setResult(null)
    setIsDecoding(true)

    try {
      const decoded = decodeBase64Input(value)
      const dimensions = await loadImageDimensions(decoded.dataUrl)
      if (requestId.current !== currentRequest) return
      setResult({ ...decoded, width: dimensions.width, height: dimensions.height })
    } catch (decodeError) {
      if (requestId.current !== currentRequest) return
      setError(getErrorMessage(decodeError))
    } finally {
      if (requestId.current === currentRequest) setIsDecoding(false)
    }
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    requestId.current += 1
    setInput(event.target.value)
    setError(null)
    setResult(null)
    setIsDecoding(false)
  }

  const handleDecode = () => {
    void decodeValue(input)
  }

  const handleSample = () => {
    const sample = createSampleDataUrl()
    setInput(sample)
    void decodeValue(sample)
  }

  const handlePaste = async () => {
    if (!navigator.clipboard?.readText) {
      notify('Clipboard text access is not available in this browser.', 'error')
      return
    }

    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        notify('The clipboard is empty.', 'error')
        return
      }
      requestId.current += 1
      setInput(text)
      setError(null)
      setResult(null)
      setIsDecoding(false)
      notify('Pasted from clipboard.', 'info')
    } catch {
      notify('Clipboard access was blocked. Paste into the field manually.', 'error')
    }
  }

  const handleClear = () => {
    requestId.current += 1
    setInput('')
    setResult(null)
    setError(null)
    setIsDecoding(false)
  }

  const copyDataUrl = async (value: string) => {
    try {
      await copyText(value)
      notify('Data URL copied to clipboard.')
    } catch (copyError) {
      notify(getErrorMessage(copyError), 'error')
    }
  }

  const handleDownload = () => {
    if (!result) return
    downloadDataUrl(`prism64-decoded.${result.extension}`, result.dataUrl)
    notify('Decoded image downloaded.')
  }

  const canDecode = input.trim().length > 0 && !isDecoding

  return (
    <div className="decode-panel">
      <section className="decode-input-card" aria-label="Base64 input">
        <div className="panel-heading panel-heading--stack">
          <div>
            <span className="eyebrow">Base64 input</span>
            <h3>Paste the code</h3>
          </div>
          <span className="input-badge">Raw or data URL</span>
        </div>

        <label className="sr-only" htmlFor="base64-input">
          Base64 string or data URL
        </label>
        <textarea
          id="base64-input"
          value={input}
          onChange={handleInputChange}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />

        <div className="decode-toolbar">
          <button type="button" className="button button--ghost button--small" onClick={handlePaste}>
            <ClipboardPaste size={14} aria-hidden="true" />
            Paste
          </button>
          <button type="button" className="button button--ghost button--small" onClick={handleSample}>
            <Sparkles size={14} aria-hidden="true" />
            Load sample
          </button>
          <button
            type="button"
            className="button button--text button--small"
            onClick={handleClear}
            disabled={!input && !result}
          >
            <Trash2 size={14} aria-hidden="true" />
            Clear
          </button>
          <span className="char-count">{input.length.toLocaleString()} chars</span>
        </div>

        {error ? (
          <div className="alert" role="alert">
            <AlertCircle size={17} aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="decode-submit">
          <p>
            <LockKeyhole size={12} aria-hidden="true" />
            Decoding happens locally.
          </p>
          <button type="button" className="button button--primary" onClick={handleDecode} disabled={!canDecode}>
            {isDecoding ? (
              <LoaderCircle className="spin" size={16} aria-hidden="true" />
            ) : (
              <ArrowRight size={16} aria-hidden="true" />
            )}
            {isDecoding ? 'Decoding…' : 'Decode image'}
          </button>
        </div>
      </section>

      <section className="decode-result-card" aria-label="Decoded image" aria-live="polite">
        {result ? (
          <>
            <div className="inspector-preview decode-preview">
              <img src={result.dataUrl} alt="Decoded image preview" />
              <span className="preview-badge">DECODED</span>
            </div>
            <div className="inspector-body">
              <div className="inspector-heading">
                <div>
                  <span className="eyebrow">Reconstructed image</span>
                  <h3>prism64-decoded.{result.extension}</h3>
                </div>
                <span className="status-pill status-pill--ready">
                  <Check size={12} aria-hidden="true" />
                  Ready
                </span>
              </div>

              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Format</span>
                  <span className="meta-value">{result.mimeType.replace('image/', '').toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Dimensions</span>
                  <span className="meta-value">{formatDimensions(result.width, result.height)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">File size</span>
                  <span className="meta-value">{formatBytes(result.size)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Extension</span>
                  <span className="meta-value">.{result.extension}</span>
                </div>
              </div>

              <div className="decode-result-actions">
                <button type="button" className="button button--primary" onClick={handleDownload}>
                  <Download size={16} aria-hidden="true" />
                  Download image
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => void copyDataUrl(result.dataUrl)}
                >
                  <Copy size={16} aria-hidden="true" />
                  Copy data URL
                </button>
              </div>

              <CodeBlock
                value={result.dataUrl}
                label="Reconstructed data URL"
                onCopy={(value) => void copyDataUrl(value)}
              />
            </div>
          </>
        ) : isDecoding ? (
          <div className="decode-empty">
            <LoaderCircle className="spin" size={30} aria-hidden="true" />
            <h3>Reconstructing image…</h3>
            <p>Validating the bytes and preparing a preview.</p>
          </div>
        ) : (
          <div className="decode-empty">
            <div className="decode-empty-art">
              <ImageIcon size={30} aria-hidden="true" />
            </div>
            <h3>Your image will appear here</h3>
            <p>
              Paste raw Base64 or a complete data URL. We will detect the format, validate the bytes, and
              rebuild the image.
            </p>
            <button type="button" className="button button--ghost" onClick={handleSample}>
              <Sparkles size={15} aria-hidden="true" />
              Try the sample
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
