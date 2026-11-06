import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import {
  AlertCircle,
  Braces,
  Check,
  ClipboardPaste,
  Code2,
  Copy,
  Download,
  FileJson,
  FileText,
  Hash,
  Image as ImageIcon,
  Layers,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEncodeWorkspace } from '../hooks/useEncodeWorkspace'
import {
  formatBytes,
  formatDimensions,
  getEncodedOverhead,
  getErrorMessage,
  mimeToExtension,
} from '../lib/base64'
import { copyText } from '../lib/clipboard'
import { downloadText } from '../lib/download'
import { buildManifest, buildSnippet, type SnippetKind } from '../lib/snippets'
import type { EncodedFile, ToastTone } from '../types'
import { CodeBlock } from './CodeBlock'

interface EncodePanelProps {
  notify: (message: string, tone?: ToastTone) => void
  active: boolean
}

const SNIPPET_KINDS: SnippetKind[] = ['html', 'css', 'markdown', 'json']

const SNIPPET_LABELS: Record<SnippetKind, string> = {
  html: 'HTML',
  css: 'CSS',
  markdown: 'Markdown',
  json: 'JSON',
}

const SNIPPET_ICONS: Record<SnippetKind, LucideIcon> = {
  html: Code2,
  css: Braces,
  markdown: FileText,
  json: Hash,
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'prism64'
}

function statusLabel(status: EncodedFile['status']): string {
  if (status === 'processing') return 'Working'
  if (status === 'error') return 'Error'
  return 'Ready'
}

function FileRow({
  file,
  selected,
  onSelect,
  onRemove,
}: {
  file: EncodedFile
  selected: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  return (
    <div className={`file-row${selected ? ' is-selected' : ''}`}>
      <button type="button" className="file-row-main" onClick={onSelect} aria-pressed={selected}>
        <span className="file-thumb">
          {file.status === 'ready' && file.dataUrl ? (
            <img src={file.dataUrl} alt="" loading="lazy" />
          ) : file.status === 'processing' ? (
            <LoaderCircle className="spin" size={18} aria-hidden="true" />
          ) : (
            <AlertCircle size={18} aria-hidden="true" />
          )}
        </span>
        <span className="file-info">
          <span className="file-name">{file.name}</span>
          <span className="file-meta">
            {file.status === 'error'
              ? 'Needs attention'
              : `${file.mimeType.replace('image/', '').toUpperCase() || 'IMAGE'} · ${formatBytes(file.size)}`}
          </span>
        </span>
        <span className={`file-status file-status--${file.status}`}>{statusLabel(file.status)}</span>
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        title={`Remove ${file.name}`}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

export function EncodePanel({ notify, active }: EncodePanelProps) {
  const {
    files,
    selectedFile,
    setSelectedId,
    readyFiles,
    outputFormat,
    setOutputFormat,
    snippetKind,
    setSnippetKind,
    selectedOutput,
    addFiles,
    addSample,
    removeFile,
    clearAll,
  } = useEncodeWorkspace(notify)

  const [isDragging, setIsDragging] = useState(false)
  const dragDepth = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCopy = useCallback(
    async (value: string, label: string) => {
      try {
        await copyText(value)
        notify(`${label} copied to clipboard.`)
      } catch (error) {
        notify(getErrorMessage(error), 'error')
      }
    },
    [notify],
  )

  const handleFiles = useCallback(
    (incoming: File[]) => {
      if (!incoming.length) {
        notify('No image files were found in that drop.', 'error')
        return
      }
      addFiles(incoming)
    },
    [addFiles, notify],
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? [])
    event.target.value = ''
    handleFiles(incoming)
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    handleFiles(Array.from(event.dataTransfer.files))
  }

  const handleClipboardPaste = async () => {
    if (!navigator.clipboard?.read) {
      notify('Clipboard image access is not available in this browser. Use drag and drop instead.', 'error')
      return
    }

    try {
      const items = await navigator.clipboard.read()
      const pasted: File[] = []

      for (const item of items) {
        const type = item.types.find((candidate) => candidate.startsWith('image/'))
        if (!type) continue
        const blob = await item.getType(type)
        pasted.push(new File([blob], `pasted-image.${mimeToExtension(type)}`, { type }))
      }

      if (!pasted.length) {
        notify('No image was found on the clipboard.', 'error')
        return
      }

      handleFiles(pasted)
    } catch {
      notify('Clipboard access was blocked. Try drag and drop or browse files.', 'error')
    }
  }

  useEffect(() => {
    if (!active) return

    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) return

      const pasted = Array.from(event.clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith('image/'),
      )
      if (!pasted.length) return

      event.preventDefault()
      handleFiles(pasted)
    }

    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [active, handleFiles])

  const copyAll = async () => {
    const values = readyFiles
      .map((file) => (outputFormat === 'dataUrl' ? file.dataUrl : file.base64))
      .filter((value): value is string => Boolean(value))

    if (!values.length) return
    await handleCopy(values.join('\n\n'), `${values.length} ${outputFormat === 'dataUrl' ? 'data URLs' : 'Base64 strings'}`)
  }

  const exportAll = () => {
    if (!readyFiles.length) return
    const manifest = buildManifest(
      readyFiles.map((file) => ({
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        width: file.width,
        height: file.height,
        dataUrl: file.dataUrl ?? '',
      })),
    )
    downloadText('prism64-export.json', manifest, 'application/json')
    notify(`Exported ${readyFiles.length} ${readyFiles.length === 1 ? 'image' : 'images'} as JSON.`)
  }

  const downloadOutput = () => {
    if (!selectedFile || !selectedOutput) return
    const suffix = outputFormat === 'dataUrl' ? 'data-url' : 'base64'
    downloadText(`${baseName(selectedFile.name)}.${suffix}.txt`, selectedOutput)
    notify('Output downloaded.')
  }

  const selectedSnippet = useMemo(() => {
    if (!selectedFile || selectedFile.status !== 'ready' || !selectedFile.dataUrl) return ''
    return buildSnippet(snippetKind, {
      name: selectedFile.name,
      mimeType: selectedFile.mimeType,
      dataUrl: selectedFile.dataUrl,
      size: selectedFile.size,
      width: selectedFile.width,
      height: selectedFile.height,
    })
  }, [selectedFile, snippetKind])

  const outputLabel = outputFormat === 'dataUrl' ? 'Data URL' : 'Raw Base64'
  const SnippetIcon = SNIPPET_ICONS[snippetKind]

  return (
    <div className="encode-panel">
      <div
        className={`dropzone${isDragging ? ' is-dragging' : ''}${files.length ? ' dropzone--compact' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label="Image drop zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={handleInputChange}
        />
        <div className="dropzone-visual">
          <Upload size={files.length ? 20 : 28} aria-hidden="true" />
        </div>
        <div className="dropzone-copy">
          <h3>{files.length ? 'Add more images' : 'Drop images into the prism'}</h3>
          <p>
            {files.length
              ? 'PNG, JPG, GIF, WebP, SVG, AVIF, or BMP'
              : 'Turn any image into a portable data URL, or paste Base64 to go the other way.'}
          </p>
        </div>
        <div className="dropzone-actions">
          <button type="button" className="button button--primary" onClick={() => inputRef.current?.click()}>
            <ImageIcon size={16} aria-hidden="true" />
            Browse files
          </button>
          <button type="button" className="button button--ghost" onClick={handleClipboardPaste}>
            <ClipboardPaste size={16} aria-hidden="true" />
            Paste image
          </button>
          <button type="button" className="button button--text" onClick={addSample}>
            <Sparkles size={15} aria-hidden="true" />
            Try a sample
          </button>
        </div>
        <p className="dropzone-note">
          <LockKeyhole size={12} aria-hidden="true" />
          Files are processed in your browser. Nothing is uploaded.
        </p>
      </div>

      {!files.length ? (
        <div className="empty-features">
          <div className="feature-chip">
            <Layers size={16} aria-hidden="true" />
            <span>Batch-ready queue</span>
          </div>
          <div className="feature-chip">
            <Code2 size={16} aria-hidden="true" />
            <span>HTML, CSS, Markdown, JSON</span>
          </div>
          <div className="feature-chip">
            <LockKeyhole size={16} aria-hidden="true" />
            <span>100% local processing</span>
          </div>
        </div>
      ) : null}

      {files.length ? (
        <div className="encode-workspace">
          <aside className="queue-panel" aria-label="Conversion queue">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Queue</span>
                <h3>
                  {files.length} {files.length === 1 ? 'image' : 'images'}
                </h3>
              </div>
              <button type="button" className="button button--text button--small" onClick={clearAll}>
                <Trash2 size={14} aria-hidden="true" />
                Clear
              </button>
            </div>
            <div className="file-list">
              {files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  selected={selectedFile?.id === file.id}
                  onSelect={() => setSelectedId(file.id)}
                  onRemove={() => removeFile(file.id)}
                />
              ))}
            </div>
            <div className="queue-footer">
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={copyAll}
                disabled={!readyFiles.length}
              >
                <Copy size={14} aria-hidden="true" />
                Copy all
              </button>
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={exportAll}
                disabled={!readyFiles.length}
              >
                <FileJson size={14} aria-hidden="true" />
                Export JSON
              </button>
            </div>
          </aside>

          <section className="inspector-panel" aria-label="Selected image output">
            {selectedFile ? (
              <>
                <div className="inspector-preview">
                  {selectedFile.status === 'ready' && selectedFile.dataUrl ? (
                    <img src={selectedFile.dataUrl} alt={`Preview of ${selectedFile.name}`} />
                  ) : selectedFile.status === 'processing' ? (
                    <div className="preview-state">
                      <LoaderCircle className="spin" size={28} aria-hidden="true" />
                      <span>Encoding image…</span>
                    </div>
                  ) : (
                    <div className="preview-state preview-state--error">
                      <AlertCircle size={28} aria-hidden="true" />
                      <span>{selectedFile.error ?? 'This image could not be encoded.'}</span>
                    </div>
                  )}
                  {selectedFile.status === 'ready' ? (
                    <span className="preview-badge">{selectedFile.mimeType.replace('image/', '').toUpperCase()}</span>
                  ) : null}
                </div>

                <div className="inspector-body">
                  <div className="inspector-heading">
                    <div>
                      <span className="eyebrow">Selected output</span>
                      <h3>{selectedFile.name}</h3>
                    </div>
                    <span className={`status-pill status-pill--${selectedFile.status}`}>
                      {selectedFile.status === 'ready' ? <Check size={12} aria-hidden="true" /> : null}
                      {statusLabel(selectedFile.status)}
                    </span>
                  </div>

                  {selectedFile.status === 'error' ? (
                    <div className="alert" role="alert">
                      <AlertCircle size={17} aria-hidden="true" />
                      <span>{selectedFile.error}</span>
                    </div>
                  ) : selectedFile.status === 'processing' ? (
                    <p className="muted-copy">Reading bytes and building your data URL…</p>
                  ) : (
                    <>
                      <div className="meta-grid">
                        <div className="meta-item">
                          <span className="meta-label">Format</span>
                          <span className="meta-value">
                            {selectedFile.mimeType.replace('image/', '').toUpperCase()}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Dimensions</span>
                          <span className="meta-value">
                            {formatDimensions(selectedFile.width, selectedFile.height)}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Original</span>
                          <span className="meta-value">{formatBytes(selectedFile.size)}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Encoded</span>
                          <span className="meta-value">{formatBytes(selectedFile.base64?.length ?? 0)}</span>
                        </div>
                      </div>

                      <div className="output-toolbar">
                        <div className="segmented segmented--small" role="group" aria-label="Output format">
                          <button
                            type="button"
                            aria-pressed={outputFormat === 'dataUrl'}
                            onClick={() => setOutputFormat('dataUrl')}
                          >
                            Data URL
                          </button>
                          <button
                            type="button"
                            aria-pressed={outputFormat === 'raw'}
                            onClick={() => setOutputFormat('raw')}
                          >
                            Raw Base64
                          </button>
                        </div>
                        <span className="overhead-pill">
                          +{getEncodedOverhead(selectedFile.size, selectedFile.base64?.length ?? 0)}% overhead
                        </span>
                        <div className="output-toolbar__spacer" />
                        <button
                          type="button"
                          className="button button--ghost button--small"
                          onClick={() => handleCopy(selectedOutput, outputLabel)}
                        >
                          <Copy size={14} aria-hidden="true" />
                          Copy
                        </button>
                        <button
                          type="button"
                          className="button button--ghost button--small"
                          onClick={downloadOutput}
                        >
                          <Download size={14} aria-hidden="true" />
                          .txt
                        </button>
                      </div>

                      <CodeBlock
                        value={selectedOutput}
                        label={outputLabel}
                        onCopy={(value) => handleCopy(value, outputLabel)}
                        onDownload={downloadOutput}
                        downloadLabel={`Download ${outputLabel}`}
                      />

                      <div className="snippet-section">
                        <div className="snippet-heading">
                          <span className="eyebrow">Drop it in</span>
                          <span className="snippet-hint">Ready-to-paste snippets</span>
                        </div>
                        <div className="snippet-tabs" role="tablist" aria-label="Snippet format">
                          {SNIPPET_KINDS.map((kind) => {
                            const Icon = SNIPPET_ICONS[kind]
                            return (
                              <button
                                key={kind}
                                type="button"
                                role="tab"
                                aria-selected={snippetKind === kind}
                                className="snippet-tab"
                                onClick={() => setSnippetKind(kind)}
                              >
                                <Icon size={13} aria-hidden="true" />
                                {SNIPPET_LABELS[kind]}
                              </button>
                            )
                          })}
                        </div>
                        <CodeBlock
                          value={selectedSnippet}
                          label={`${SNIPPET_LABELS[snippetKind]} snippet`}
                          onCopy={(value) => handleCopy(value, `${SNIPPET_LABELS[snippetKind]} snippet`)}
                          truncateAt={1200}
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="inspector-empty">
                <SnippetIcon size={28} aria-hidden="true" />
                <p>Select an image to inspect its output.</p>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
