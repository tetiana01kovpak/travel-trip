import { useNavigate, useParams } from 'react-router-dom'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { CountryForm } from '@/components/admin/forms/CountryForm'
import { useAdminCountry, useCreateCountry, useUpdateCountry } from '@/hooks/useAdminCountries'
import { toImageAssets } from '@/lib/formatters'
import { paths } from '@/router/paths'
import type { CountryFormValues } from '@/lib/schemas/countrySchema'

export default function AdminCountryFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: country, isLoading, isError, refetch } = useAdminCountry(id)
  const createCountry = useCreateCountry()
  const updateCountry = useUpdateCountry()

  function handleSubmit(values: CountryFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      images: values.images,
    }
    if (isEdit && id) {
      updateCountry.mutate({ id, input: payload }, { onSuccess: () => navigate(paths.adminCountries) })
    } else {
      createCountry.mutate(payload, { onSuccess: () => navigate(paths.adminCountries) })
    }
  }

  if (isEdit && isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />
  }

  if (isEdit && (isError || !country)) {
    return <ErrorState message="We couldn't load this country." onRetry={() => refetch()} />
  }

  return (
    <div>
      <BreadcrumbTrail
        items={[{ label: 'Countries', to: paths.adminCountries }, { label: isEdit ? 'Edit' : 'New' }]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">
        {isEdit ? 'Edit country' : 'New country'}
      </h1>
      <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <CountryForm
          defaultValues={
            country
              ? {
                  name: country.name,
                  slug: country.slug,
                  description: country.description ?? '',
                  images: toImageAssets(country.images),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createCountry.isPending || updateCountry.isPending}
          submitLabel={isEdit ? 'Save changes' : 'Create country'}
        />
      </div>
    </div>
  )
}
