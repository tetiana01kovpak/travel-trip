import { useQuery } from '@tanstack/react-query'
import { getBlogPosts } from '@/api/blog'
import { BLOG_PAGE_SIZE } from '@/lib/constants'

export function useBlogPosts(page = 1, limit = BLOG_PAGE_SIZE) {
  return useQuery({
    queryKey: ['blogPosts', page, limit],
    queryFn: () => getBlogPosts(page, limit),
    placeholderData: (prev) => prev,
  })
}
