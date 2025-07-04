'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    const verificar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: pessoas, error } = await supabase
        .from('pessoas')
        .select('tipo')
        .eq('email', user.email)
        .limit(1)

      if (!error && pessoas && pessoas.length > 0 && pessoas[0].tipo === 'administrador') {
        setAutorizado(true)
      } else {
        router.push('/login')
      }

      setVerificando(false)
    }

    verificar()
  }, [router])

  if (verificando) {
    return <p className="text-center mt-10">Verificando acesso...</p>
  }

  return autorizado ? <>{children}</> : null
}
