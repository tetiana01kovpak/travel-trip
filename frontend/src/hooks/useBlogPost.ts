import { useQuery } from '@tanstack/react-query'
import { getBlogPost } from '@/api/blog'

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPost(slug as string),
    enabled: Boolean(slug),
  })
}
