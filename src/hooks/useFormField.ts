// src/hooks/useFormField.ts
import { useState } from 'react'

export function useFormFields<T>(initial: T) {
  const [form, setForm] = useState<T>(initial)
  const setField = (f: keyof T) => (valOrEvent: any) => {
    const value = (valOrEvent && typeof valOrEvent === 'object' && 'target' in valOrEvent)
      ? valOrEvent.target.value
      : valOrEvent;
    setForm(p => ({ ...p, [f]: value }))
  }
  return { form, setForm, setField }
}