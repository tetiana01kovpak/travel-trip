import { apiFetch, buildQuery } from '@/api/client'
import { coverImageToArray } from '@/api/mappers'
import { BLOG_PAGE_SIZE } from '@/lib/constants'
import type { ListParams, Paginated } from '@/types/api'
import type { BlogPost, BlogPostInput } from '@/types/blogPost'

interface BlogPostWire extends Omit<BlogPost, 'body' | 'images'> {
  content?: string
  coverImageUrl?: string
  coverImagePublicId?: string
}

function mapBlogPost(raw: BlogPostWire): BlogPost {
  const { content, coverImageUrl, coverImagePublicId, ...rest } = raw
  return { ...rest, body: content ?? '', images: coverImageToArray(coverImageUrl, coverImagePublicId) }
}

function toBlogPostWireBody(input: Partial<BlogPostInput>): Record<string, unknown> {
  const { body, images, ...rest } = input
  return {
    ...rest,
    ...(body !== undefined ? { content: body } : {}),
    ...(images !== undefined
      ? { coverImageUrl: images[0]?.url ?? '', coverImagePublicId: images[0]?.publicId ?? '' }
      : {}),
  }
}

export async function getBlogPosts(page = 1, limit = BLOG_PAGE_SIZE): Promise<Paginated<BlogPost>> {
  const result = await apiFetch<Paginated<BlogPostWire>>(`/api/blog${buildQuery({ page, limit })}`)
  return { ...result, items: result.items.map(mapBlogPost) }
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const raw = await apiFetch<BlogPostWire>(`/api/blog/${encodeURIComponent(slug)}`)
  return mapBlogPost(raw)
}

// --- Admin ---

export async function adminListBlogPosts(params: ListParams = {}): Promise<Paginated<BlogPost>> {
  const result = await apiFetch<Paginated<BlogPostWire>>(`/api/admin/blog${buildQuery(params)}`)
  return { ...result, items: result.items.map(mapBlogPost) }
}

export async function adminGetBlogPost(id: string): Promise<BlogPost> {
  const raw = await apiFetch<BlogPostWire>(`/api/admin/blog/${id}`)
  return mapBlogPost(raw)
}

export async function adminCreateBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const raw = await apiFetch<BlogPostWire>('/api/admin/blog', {
    method: 'POST',
    json: toBlogPostWireBody(input),
  })
  return mapBlogPost(raw)
}

export async function adminUpdateBlogPost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const raw = await apiFetch<BlogPostWire>(`/api/admin/blog/${id}`, {
    method: 'PATCH',
    json: toBlogPostWireBody(input),
  })
  return mapBlogPost(raw)
}

export function adminDeleteBlogPost(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/blog/${id}`, { method: 'DELETE' })
}
