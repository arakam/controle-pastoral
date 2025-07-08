'use client'

import { useEffect, useState } from 'react'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { supabase } from '@/lib/supabase'

interface Empresa {
  id: string
  nome: string
  segmento: string
  cidade: string
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    supabase
      .from('empresas')
      .select('*')
      .order('nome', { ascending: true })
      .then(({ data }) => setEmpresas(data as Empresa[]))
  }, [])

  return (
    <ParticipanteLayout>
      <h1 className="text-2xl font-bold mb-4">Empresas Cadastradas</h1>
      <ul className="space-y-4">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="bg-white shadow p-4 rounded">
            <h2 className="font-semibold">{empresa.nome}</h2>
            <p>📌 {empresa.segmento} - {empresa.cidade}</p>
          </li>
        ))}
      </ul>
    </ParticipanteLayout>
  )
}
