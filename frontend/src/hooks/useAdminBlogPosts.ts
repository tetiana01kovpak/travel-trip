import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminCreateBlogPost,
  adminDeleteBlogPost,
  adminGetBlogPost,
  adminListBlogPosts,
  adminUpdateBlogPost,
} from '@/api/blog'
import type { ApiError } from '@/api/client'
import type { ListParams } from '@/types/api'
import type { BlogPostInput } from '@/types/blogPost'

export function useAdminBlogPosts(params: ListParams = {}) {
  return useQuery({
    queryKey: ['admin', 'blogPosts', params],
    queryFn: () => adminListBlogPosts(params),
    placeholderData: (prev) => prev,
  })
}

export function useAdminBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'blogPost', id],
    queryFn: () => adminGetBlogPost(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BlogPostInput) => adminCreateBlogPost(input),
    onSuccess: () => {
      toast.success('Post published')
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not create post'),
  })
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<BlogPostInput> }) =>
      adminUpdateBlogPost(id, input),
    onSuccess: () => {
      toast.success('Post updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogPost'] })
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['blogPost'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not update post'),
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteBlogPost(id),
    onSuccess: () => {
      toast.success('Post deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogPosts'] })
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not delete post'),
  })
}
