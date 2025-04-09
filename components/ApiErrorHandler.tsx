// components/ApiErrorHandler.tsx
'use client'

import { useEffect } from 'react'
import { setErrorHandler } from '@/services/api/apiCllient'
import { useError } from '@/contexts/ErrorContext'

export default function ApiErrorHandler() {
  const { addError } = useError()

  useEffect(() => {
    setErrorHandler((errorMessage: string) => {
      addError({
        mensagem: errorMessage, // Corrigido de "menssagem" para "mensagem"
        tipo: 'error',
        id: Date.now().toString()
      })
    })
  }, [addError])

  return null
}