export interface ImageDimensions {
  width: number
  height: number
}

export function loadImageDimensions(source: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('The image has no readable dimensions.'))
        return
      }
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      reject(new Error('This image could not be rendered by your browser.'))
    }
    image.src = source
  })
}
