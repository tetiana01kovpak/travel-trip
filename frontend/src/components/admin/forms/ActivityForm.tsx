import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapContainer, TileLayer } from 'react-leaflet'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { FormField, formInputClass } from '@/components/common/FormField'
import { ImagePickerModal } from '@/components/admin/ImagePickerModal'
import { LocationMarker } from '@/components/map/LocationMarker'
import { DEFAULT_MAP_CENTER } from '@/lib/constants'
import { activitySchema } from '@/lib/schemas/activitySchema'
import type { ActivityFormValues } from '@/lib/schemas/activitySchema'

export interface ActivityFormTownOption {
  id: string
  name: string
}

export interface ActivityFormProps {
  towns: ActivityFormTownOption[]
  defaultValues?: Partial<ActivityFormValues>
  onSubmit: (values: ActivityFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function ActivityForm({
  towns,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save activity',
}: ActivityFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      currency: 'USD',
      townId: towns[0]?.id ?? '',
      images: [],
      location: undefined,
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'images' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" error={errors.name?.message}>
          <input {...register('name')} className={formInputClass} placeholder="Sunset kayak tour" />
        </FormField>
        <FormField label="Slug" error={errors.slug?.message} hint="Leave blank to auto-generate">
          <input {...register('slug')} className={formInputClass} placeholder="sunset-kayak-tour" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Price" error={errors.price?.message}>
          <input
            type="number"
            min={0}
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className={formInputClass}
            placeholder="49.00"
          />
        </FormField>
        <FormField label="Currency" error={errors.currency?.message}>
          <input {...register('currency')} className={formInputClass} placeholder="USD" maxLength={3} />
        </FormField>
        <FormField label="Town" error={errors.townId?.message}>
          <select {...register('townId')} className={formInputClass}>
            {towns.map((town) => (
              <option key={town.id} value={town.id}>
                {town.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={5}
          className={formInputClass}
          placeholder="What makes this activity special…"
        />
      </FormField>

      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <FormField
            label="Location"
            error={errors.location?.lat?.message ?? errors.location?.lng?.message}
            hint="Click the map to drop a pin, or enter coordinates manually."
          >
            <div className="mb-3 grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                value={field.value?.lat ?? ''}
                onChange={(e) => field.onChange({ lat: Number(e.target.value), lng: field.value?.lng ?? 0 })}
                className={formInputClass}
                placeholder="Latitude"
              />
              <input
                type="number"
                step="any"
                value={field.value?.lng ?? ''}
                onChange={(e) => field.onChange({ lat: field.value?.lat ?? 0, lng: Number(e.target.value) })}
                className={formInputClass}
                placeholder="Longitude"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-xl border border-slate-200">
              <MapContainer
                center={field.value ? [field.value.lat, field.value.lng] : DEFAULT_MAP_CENTER}
                zoom={field.value ? 10 : 2}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={field.value ?? null} onChange={field.onChange} />
              </MapContainer>
            </div>
          </FormField>
        )}
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Images</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
            leftIcon={<ImagePlus className="size-4" />}
          >
            Add image
          </Button>
        </div>
        {fields.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
            No images yet.
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
