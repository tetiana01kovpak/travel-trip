export interface AdminUser {
  username: string
}

export interface LoginInput {
  username: string
  password: string
}

export interface PixabayHit {
  id: number
  pageURL: string
  tags: string
  previewURL: string
  webformatURL: string
  largeImageURL?: string
  user: string
  likes: number
  views: number
  imageWidth?: number
  imageHeight?: number
}

export interface PixabaySearchResponse {
  total: number
  totalHits: number
  hits: PixabayHit[]
}

export interface UploadImageResponse {
  url: string
  publicId: string
  width?: number
  height?: number
}
