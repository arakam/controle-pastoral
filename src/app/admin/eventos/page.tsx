'use client'

import RequireAdmin from '@/components/RequireAdmin'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Evento {
  id: string
  nome: string
  data: string
  local: string
}

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    const buscarEventos = async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('id, nome, data, local')
        .order('data', { ascending: false })

      if (error) setErro('Erro ao buscar eventos')
      else setEventos(data as Evento[])
    }

    buscarEventos()
  }, [])

  return (
<RequireAdmin>
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Eventos Cadastrados</h1>

      <Link
        href="/admin/eventos/novo"
        className="inline-block mb-4 text-blue-600 underline"
      >
        + Novo Evento
      </Link>

      {erro && <p className="text-red-500">{erro}</p>}

      <ul className="space-y-4">
        {eventos.map((evento) => (
          <li key={evento.id} className="p-4 border rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{evento.nome}</h2>
            <p>Data: {evento.data}</p>
            <p>Local: {evento.local}</p>

            <div className="mt-2">
              <Link
                href={`/admin/eventos/${evento.id}/checkins`}
                className="text-sm text-green-700 underline mr-4"
              >
                Ver Check-ins
              </Link>

              <Link
                href={`/checkin/${evento.id}`}
                className="text-sm text-blue-700 underline"
              >
                Tela de Check-in
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
</RequireAdmin>
  )
}
