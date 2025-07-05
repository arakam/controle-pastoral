'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { session, supabase } = useSupabase() //  fora do useEffect
  const [verificando, setVerificando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    const verificar = async () => {
      const email = session?.user?.email
      //const tipo = session?.user?.tipo
      console.log('Email logado:', email)
      //console.log('Tipo logado:', tipo)

      if (!email) {
        router.push('/login')
        return
      }

      const { data: pessoa, error } = await supabase
        .from('pessoas')
        .select('tipo')
        .ilike('email', email!) //busca case-insensitive
        .maybeSingle()

      console.log('Pessoa encontrada:', pessoa)
      if (!error && pessoa?.tipo === 'administrador') {
        setAutorizado(true)
      } else {
        router.push('/login')
      }

      setVerificando(false)
    }

    verificar()
  }, [router, session, supabase]) // inclua dependências aqui

  if (verificando) {
    return <p className="text-center mt-10">Verificando acesso...</p>
  }

  return autorizado ? <>{children}</> : null
}
