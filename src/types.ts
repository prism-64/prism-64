export type ConversionStatus = 'processing' | 'ready' | 'error'

export interface EncodedFile {
  id: string
  name: string
  mimeType: string
  size: number
  width?: number
  height?: number
  dataUrl?: string
  base64?: string
  status: ConversionStatus
  error?: string
}

export type OutputFormat = 'dataUrl' | 'raw'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastState {
  id: number
  message: string
  tone: ToastTone
}
