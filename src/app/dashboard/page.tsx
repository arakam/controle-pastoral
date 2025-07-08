// ✅ Arquivo: app/dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { useSupabase } from '@/components/SupabaseProvider'

export default function Dashboard() {
  const { session, supabase } = useSupabase()
  const [pessoa, setPessoa] = useState<any>(null)

  useEffect(() => {
    const buscar = async () => {
      const { data } = await supabase
        .from('pessoas')
        .select('*')
        .eq('email', session?.user?.email)
        .maybeSingle()
      setPessoa(data)
    }
    buscar()
  }, [session, supabase])

  return (
    <ParticipanteLayout>
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      {pessoa && (
        <div className="space-y-2">
          <p><strong>Nome:</strong> {pessoa.nome}</p>
          <p><strong>Email:</strong> {pessoa.email}</p>
          <p><strong>Telefone:</strong> {pessoa.telefone}</p>
        </div>
      )}
    </ParticipanteLayout>
  )
}
