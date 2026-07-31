import { useNavigate, useParams } from 'react-router-dom'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { TownForm } from '@/components/admin/forms/TownForm'
import { useAdminCountries } from '@/hooks/useAdminCountries'
import { useAdminTown, useCreateTown, useUpdateTown } from '@/hooks/useAdminTowns'
import { toImageAssets } from '@/lib/formatters'
import { paths } from '@/router/paths'
import type { TownFormValues } from '@/lib/schemas/townSchema'

export default function AdminTownFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: countriesPage, isLoading: countriesLoading } = useAdminCountries({ limit: 200 })
  const { data: town, isLoading, isError, refetch } = useAdminTown(id)
  const createTown = useCreateTown()
  const updateTown = useUpdateTown()

  const countries = countriesPage?.items ?? []

  function handleSubmit(values: TownFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      countryId: values.countryId,
      images: values.images,
    }
    if (isEdit && id) {
      updateTown.mutate({ id, input: payload }, { onSuccess: () => navigate(paths.adminTowns) })
    } else {
      createTown.mutate(payload, { onSuccess: () => navigate(paths.adminTowns) })
    }
  }

  if ((isEdit && isLoading) || countriesLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />
  }

  if (isEdit && (isError || !town)) {
    return <ErrorState message="We couldn't load this town." onRetry={() => refetch()} />
  }

  return (
    <div>
      <BreadcrumbTrail
        items={[{ label: 'Towns', to: paths.adminTowns }, { label: isEdit ? 'Edit' : 'New' }]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">{isEdit ? 'Edit town' : 'New town'}</h1>
      <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <TownForm
          countries={countries.map((c) => ({ id: c.id, name: c.name }))}
          defaultValues={
            town
              ? {
                  name: town.name,
                  slug: town.slug,
                  description: town.description ?? '',
                  countryId: town.countryId,
                  images: toImageAssets(town.images),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createTown.isPending || updateTown.isPending}
          submitLabel={isEdit ? 'Save changes' : 'Create town'}
        />
      </div>
    </div>
  )
}
