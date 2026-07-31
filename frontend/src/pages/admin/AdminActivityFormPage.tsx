import { useNavigate, useParams } from 'react-router-dom'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { ActivityForm } from '@/components/admin/forms/ActivityForm'
import { useAdminTowns } from '@/hooks/useAdminTowns'
import { useAdminActivity, useCreateActivity, useUpdateActivity } from '@/hooks/useAdminActivities'
import { toImageAssets } from '@/lib/formatters'
import { paths } from '@/router/paths'
import type { ActivityFormValues } from '@/lib/schemas/activitySchema'

export default function AdminActivityFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: townsPage, isLoading: townsLoading } = useAdminTowns({ limit: 500 })
  const { data: activity, isLoading, isError, refetch } = useAdminActivity(id)
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()

  const towns = townsPage?.items ?? []

  function handleSubmit(values: ActivityFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      price: values.price,
      currency: values.currency || undefined,
      townId: values.townId,
      images: values.images,
      location: values.location,
    }
    if (isEdit && id) {
      updateActivity.mutate({ id, input: payload }, { onSuccess: () => navigate(paths.adminActivities) })
    } else {
      createActivity.mutate(payload, { onSuccess: () => navigate(paths.adminActivities) })
    }
  }

  if ((isEdit && isLoading) || townsLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />
  }

  if (isEdit && (isError || !activity)) {
    return <ErrorState message="We couldn't load this activity." onRetry={() => refetch()} />
  }

  return (
    <div>
      <BreadcrumbTrail
        items={[{ label: 'Activities', to: paths.adminActivities }, { label: isEdit ? 'Edit' : 'New' }]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">
        {isEdit ? 'Edit activity' : 'New activity'}
      </h1>
      <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <ActivityForm
          towns={towns.map((t) => ({ id: t.id, name: t.name }))}
          defaultValues={
            activity
              ? {
                  name: activity.name,
                  slug: activity.slug,
                  description: activity.description ?? '',
                  price: activity.price,
                  currency: activity.currency ?? 'USD',
                  townId: activity.townId,
                  images: toImageAssets(activity.images),
                  location: activity.location,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createActivity.isPending || updateActivity.isPending}
          submitLabel={isEdit ? 'Save changes' : 'Create activity'}
        />
      </div>
    </div>
  )
}
