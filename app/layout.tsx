// app/layout.tsx
import type { Metadata } from 'next'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { AuthProvider } from '@/contexts/UsuarioContext'
import ErrorNotification from '@/components/ErrorNotification'
import ApiErrorHandler from '@/components/ApiErrorHandler'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Provider de erros */}
        <ErrorProvider>
          {/* Provider com as informações do usuário */}
          <AuthProvider>
            {/* Componente que escuta e dispara erros da API */}
            <ApiErrorHandler />

            {/* Notificações globais de erro */}
            <ErrorNotification />

            {/* Todo o resto da sua aplicação */}
            {children}
          </AuthProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
