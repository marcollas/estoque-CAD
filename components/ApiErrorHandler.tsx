// components/ApiErrorHandler.tsx
'use client'

import { useEffect } from 'react'
import { setErrorHandler } from '@/services/api/apiCllient'
import { useError } from '@/contexts/NotificationContext'

export default function ApiErrorHandler() {
  const { addNotification } = useError()

  useEffect(() => {
    setErrorHandler((errorMessage: string) => {
      addNotification({
        mensagem: errorMessage, 
        tipo: 'error',
        id: crypto.randomUUID()
      })
    })
  }, [addNotification])

  return null
}