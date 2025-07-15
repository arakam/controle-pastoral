'use client'

import { useEffect, useState } from 'react'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { supabase } from '@/lib/supabase'

interface Evento {
  id: string
  nome: string
  data: string
  local: string
}

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const hoje = new Date().toISOString()
    supabase
      .from('eventos')
      .select('*')
      .gte('data', hoje)
      .order('data', { ascending: true })
      .then(({ data }) => setEventos(data as Evento[]))
  }, [])

  return (
    <ParticipanteLayout>
      <h1 className="text-2xl font-bold text-gray-800  mb-4">Próximos Eventos</h1>
      <ul className="space-y-4">
        {eventos.map((ev) => (
          <li key={ev.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold text-black-800 ">{ev.nome}</h2>
            <p>📍 {ev.local}</p>
            <p>📅 {new Date(ev.data).toLocaleDateString('pt-BR')}</p>
          </li>
        ))}
      </ul>
    </ParticipanteLayout>
  )
}
