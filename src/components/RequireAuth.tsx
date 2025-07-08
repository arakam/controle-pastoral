'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session && pathname !== '/login') {
      router.replace('/login')
    }
  }, [session, pathname, router])

  if (!session && pathname !== '/login') {
    return <p className="text-center mt-10">Verificando sessão...</p>
  }

  return <>{children}</>
}
