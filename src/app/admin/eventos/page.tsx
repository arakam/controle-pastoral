'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  MapPin,
  Plus,
  Eye,
  QrCode,
  Users,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import RequireAdmin from '@/components/RequireAdmin'
import AdminLayout from '@/components/AdminLayout'
import { useSupabase } from '@/components/SupabaseProvider'

interface Evento {
  id: string
  nome: string
  data: string
  local: string
}

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [totalCheckins, setTotalCheckins] = useState<Record<string, number>>({})
  const [erro, setErro] = useState('')
  const { session } = useSupabase()

  useEffect(() => {
    const buscarEventos = async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('id, nome, data, local')
        .order('data', { ascending: false })

      if (error) setErro('Erro ao buscar eventos')
      else setEventos(data as Evento[])
    }

    const buscarTotaisCheckin = async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('evento_id')

      if (!error && data) {
        const totais: Record<string, number> = {}
        for (const row of data) {
          if (row.evento_id) {
            totais[row.evento_id] = (totais[row.evento_id] || 0) + 1
          }
        }
        setTotalCheckins(totais)
      }
    }


    buscarEventos()
    buscarTotaisCheckin()
  }, [])

  return (
    <RequireAdmin>
      <AdminLayout>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Eventos Cadastrados
          </h2>

          <Link
            href="/admin/eventos/novo"
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </Link>
        </div>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <ul className="grid gap-4">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">{evento.nome}</h3>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> {evento.data}
                </span>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {evento.local}
              </p>

              <div className="mt-3 flex gap-4 text-sm items-center flex-wrap">
                <Link
                  href={`/admin/eventos/${evento.id}/checkins`}
                  className="text-green-700 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver Check-ins
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {totalCheckins[evento.id] ?? 0}
                  </span>
                </Link>

                <Link
                  href={`/checkin/${evento.id}`}
                  className="text-blue-700 hover:underline flex items-center gap-1"
                >
                  <QrCode className="w-4 h-4" />
                  Tela de Check-in
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </AdminLayout>
    </RequireAdmin>
  )
}
