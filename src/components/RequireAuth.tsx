'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  // Rotas públicas que não exigem login
  const rotasPublicas = ['/login', '/checkin', '/cadastro', '/empresas']
  const isPublica = rotasPublicas.some((path) => pathname.startsWith(path))

  useEffect(() => {
    if (!session && !isPublica) {
      router.replace('/login')
    }
  }, [session, pathname, isPublica, router])

  if (!session && !isPublica) {
    return <p className="text-center mt-10">Verificando sessão...</p>
  }

  return <>{children}</>
}
