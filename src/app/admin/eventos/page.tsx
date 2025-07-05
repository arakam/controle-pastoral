'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RequireAdmin from '@/components/RequireAdmin'
import BotaoLogout from '@/components/BotaoLogout'
import { supabase } from '@/lib/supabase'
import { useSupabase } from '@/components/SupabaseProvider'
import {
  CalendarDays,
  MapPin,
  LogOut,
  Plus,
  Eye,
  QrCode,
} from 'lucide-react'

interface Evento {
  id: string
  nome: string
  data: string
  local: string
}

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [erro, setErro] = useState('')
  const { session } = useSupabase()
  const email = session?.user?.email

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Controle Pastoral</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="hidden sm:inline">{email}</span>
            <BotaoLogout />
          </div>
        </header>

        {/* Conteúdo */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
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

                <div className="mt-3 flex gap-4 text-sm">
                  <Link
                    href={`/admin/eventos/${evento.id}/checkins`}
                    className="text-green-700 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Check-ins
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
        </main>
      </div>
    </RequireAdmin>
  )
}
