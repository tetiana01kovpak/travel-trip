import type { ImageAsset, ImageLike } from '@/types/api'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  body: string
  images?: ImageLike[]
  author?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface BlogPostInput {
  title: string
  slug?: string
  excerpt?: string
  body: string
  images?: ImageAsset[]
}
