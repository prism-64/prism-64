import { useCallback, useMemo, useState } from 'react'
import {
  encodeFile,
  getErrorMessage,
  inferMimeTypeFromName,
  normalizeMimeType,
} from '../lib/base64'
import { loadImageDimensions } from '../lib/image'
import { createSampleFile } from '../lib/sample'
import type { SnippetKind } from '../lib/snippets'
import type { EncodedFile, OutputFormat, ToastTone } from '../types'

type Notify = (message: string, tone?: ToastTone) => void

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `file-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useEncodeWorkspace(notify: Notify) {
  const [files, setFiles] = useState<EncodedFile[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('dataUrl')
  const [snippetKind, setSnippetKind] = useState<SnippetKind>('html')

  const processFile = useCallback(async (id: string, file: File) => {
    try {
      const encoded = await encodeFile(file)
      const dimensions = await loadImageDimensions(encoded.dataUrl)
      setFiles((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                ...encoded,
                width: dimensions.width,
                height: dimensions.height,
                status: 'ready',
              }
            : item,
        ),
      )
    } catch (error) {
      setFiles((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'error',
                error: getErrorMessage(error),
              }
            : item,
        ),
      )
    }
  }, [])

  const addFiles = useCallback(
    (incoming: File[]) => {
      const readable = incoming.filter((file) => file.size > 0)
      if (!readable.length) {
        notify('No readable image files were found.', 'error')
        return
      }

      const items: EncodedFile[] = readable.map((file) => ({
        id: createId(),
        name: file.name || 'Pasted image',
        mimeType: normalizeMimeType(file.type || inferMimeTypeFromName(file.name)),
        size: file.size,
        status: 'processing',
      }))

      setFiles((current) => [...items, ...current])
      setSelectedId((current) => current ?? items[0].id)
      items.forEach((item, index) => {
        void processFile(item.id, readable[index])
      })
    },
    [notify, processFile],
  )

  const addSample = useCallback(() => {
    addFiles([createSampleFile()])
  }, [addFiles])

  const removeFile = useCallback((id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
    setSelectedId(null)
  }, [])


  const selectedFile = useMemo(
    () => files.find((file) => file.id === selectedId) ?? files[0] ?? null,
    [files, selectedId],
  )

  const readyFiles = useMemo(() => files.filter((file) => file.status === 'ready'), [files])

  const selectedOutput = useMemo(() => {
    if (!selectedFile || selectedFile.status !== 'ready') return ''
    return outputFormat === 'dataUrl' ? selectedFile.dataUrl ?? '' : selectedFile.base64 ?? ''
  }, [outputFormat, selectedFile])

  return {
    files,
    selectedFile,
    selectedId,
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
  }
}
