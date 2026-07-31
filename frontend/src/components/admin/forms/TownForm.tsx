import { Fragment, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown, ImagePlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { FormField, formInputClass } from '@/components/common/FormField'
import { ImagePickerModal } from '@/components/admin/ImagePickerModal'
import { cn } from '@/lib/cn'
import { townSchema } from '@/lib/schemas/townSchema'
import type { TownFormValues } from '@/lib/schemas/townSchema'

export interface TownFormCountryOption {
  id: string
  name: string
}

export interface TownFormProps {
  countries: TownFormCountryOption[]
  defaultValues?: Partial<TownFormValues>
  onSubmit: (values: TownFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function TownForm({
  countries,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save town',
}: TownFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TownFormValues>({
    resolver: zodResolver(townSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      countryId: countries[0]?.id ?? '',
      images: [],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'images' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" error={errors.name?.message}>
          <input {...register('name')} className={formInputClass} placeholder="Lisbon" />
        </FormField>
        <FormField label="Slug" error={errors.slug?.message} hint="Leave blank to auto-generate">
          <input {...register('slug')} className={formInputClass} placeholder="lisbon" />
        </FormField>
      </div>

      <Controller
        control={control}
        name="countryId"
        render={({ field }) => {
          const selected = countries.find((c) => c.id === field.value)
          return (
            <FormField label="Country" error={errors.countryId?.message}>
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <ListboxButton
                    className={cn(formInputClass, 'flex items-center justify-between text-left')}
                  >
                    <span>{selected?.name ?? 'Select a country'}</span>
                    <ChevronsUpDown className="size-4 text-slate-400" />
                  </ListboxButton>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-100 bg-white py-1 text-sm shadow-lift">
                      {countries.map((country) => (
                        <ListboxOption
                          key={country.id}
                          value={country.id}
                          className={({ focus }) =>
                            cn('flex cursor-pointer items-center justify-between px-4 py-2', focus && 'bg-lagoon-50')
                          }
                        >
                          {({ selected: isSelected }) => (
                            <>
                              <span className={isSelected ? 'font-medium text-lagoon-700' : 'text-slate-700'}>
                                {country.name}
                              </span>
                              {isSelected ? <Check className="size-4 text-lagoon-600" /> : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </FormField>
          )
        }}
      />

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={5}
          className={formInputClass}
          placeholder="A short overview of this town…"
        />
      </FormField>

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
