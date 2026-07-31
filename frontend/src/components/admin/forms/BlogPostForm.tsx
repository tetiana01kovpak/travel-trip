import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { FormField, formInputClass } from '@/components/common/FormField'
import { ImagePickerModal } from '@/components/admin/ImagePickerModal'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { cn } from '@/lib/cn'
import { blogPostSchema } from '@/lib/schemas/blogPostSchema'
import type { BlogPostFormValues } from '@/lib/schemas/blogPostSchema'

export interface BlogPostFormProps {
  defaultValues?: Partial<BlogPostFormValues>
  onSubmit: (values: BlogPostFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function BlogPostForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save post',
}: BlogPostFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      images: [],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'images' })
  const body = watch('body')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Title" error={errors.title?.message}>
          <input {...register('title')} className={formInputClass} placeholder="10 days in the Azores" />
        </FormField>
        <FormField label="Slug" error={errors.slug?.message} hint="Leave blank to auto-generate">
          <input {...register('slug')} className={formInputClass} placeholder="10-days-in-the-azores" />
        </FormField>
      </div>

      <FormField label="Excerpt" error={errors.excerpt?.message} hint="Short summary shown on the blog list.">
        <textarea
          {...register('excerpt')}
          rows={2}
          className={formInputClass}
          placeholder="A quick teaser for this post…"
        />
      </FormField>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">Body (Markdown)</span>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField label="Markdown source" error={errors.body?.message}>
            <textarea
              {...register('body')}
              rows={16}
              className={cn(formInputClass, 'font-mono text-xs leading-relaxed')}
              placeholder={'## Heading\n\nWrite your post in Markdown…'}
            />
          </FormField>
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Live preview</p>
            <div className="h-full max-h-[26rem] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
              {body ? (
                <BlogPostContent markdown={body} />
              ) : (
                <p className="text-sm text-slate-400">Nothing to preview yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Cover image</span>
          {fields.length === 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              leftIcon={<ImagePlus className="size-4" />}
            >
              Add image
            </Button>
          ) : null}
        </div>
        {fields.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
            No cover image yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
              >
                <img src={field.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>

      <ImagePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(img) => append({ url: img.url, publicId: img.publicId, width: img.width, height: img.height })}
      />
    </form>
  )
}
