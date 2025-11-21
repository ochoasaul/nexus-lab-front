import type { ChangeEvent } from 'react'
import { useState } from 'react'

type FormElements = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export function useForm<TValues extends Record<string, string>>(initialValues: TValues) {
  const [values, setValues] = useState<TValues>(initialValues)

  const handleChange = (event: ChangeEvent<FormElements>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value } as TValues))
  }

  const reset = () => setValues(initialValues)

  return { values, handleChange, reset } as const
}
