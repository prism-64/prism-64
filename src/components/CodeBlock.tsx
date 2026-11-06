import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Download } from 'lucide-react'

interface CodeBlockProps {
  value: string
  label: string
  onCopy: (value: string) => void
  onDownload?: () => void
  downloadLabel?: string
  truncateAt?: number
}

export function CodeBlock({
  value,
  label,
  onCopy,
  onDownload,
  downloadLabel = 'Download',
  truncateAt = 1800,
}: CodeBlockProps) {
  const [expandedValue, setExpandedValue] = useState<string | null>(null)
  const expanded = expandedValue === value
  const shouldTruncate = value.length > truncateAt
  const displayValue = expanded || !shouldTruncate ? value : `${value.slice(0, truncateAt)}…`

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__label">{label}</span>
        <div className="code-block__actions">
          {onDownload ? (
            <button
              type="button"
              className="icon-button icon-button--small"
              onClick={onDownload}
              aria-label={downloadLabel}
              title={downloadLabel}
            >
              <Download size={14} aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            className="icon-button icon-button--small"
            onClick={() => onCopy(value)}
            aria-label={`Copy ${label}`}
            title={`Copy ${label}`}
          >
            <Copy size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
      <pre>
        <code>{displayValue}</code>
      </pre>
      {shouldTruncate ? (
        <button type="button" className="code-block__expand" onClick={() => setExpandedValue(expanded ? null : value)}>
          {expanded ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
          {expanded ? 'Collapse output' : `Show full output (${value.length.toLocaleString()} characters)`}
        </button>
      ) : null}
    </div>
  )
}
