// src/hooks/useFormField.ts
import { useState } from 'react'

export function useFormFields<T>(initial: T) {
  const [form, setForm] = useState<T>(initial)
  const setField = (f: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))
  return { form, setForm, setField }
}