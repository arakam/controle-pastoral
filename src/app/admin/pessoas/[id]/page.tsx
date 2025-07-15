'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import FormularioPessoa from '@/components/FormularioPessoa'
import { supabase } from '@/lib/supabase'
import { Calendar } from 'lucide-react'

interface Evento {
  id: string
  nome: string
  data: string
  local?: string
}

export default function EditarPessoaPage() {
  const { id } = useParams() as { id: string }
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const carregarEventos = async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('evento: evento_id (id, nome, data, local)')
        .eq('pessoa_id', id)

      if (!error && data) {
        const eventosUnicos = new Map<string, Evento>()
        for (const item of data) {
          const ev = Array.isArray(item.evento) ? item.evento[0] : item.evento
          if (ev?.id) eventosUnicos.set(ev.id, ev)
        }
        setEventos(Array.from(eventosUnicos.values()))
      }
    }

    carregarEventos()
  }, [id])

  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold text-gray-800 mb-4">Editar Pessoa</h1>
        <FormularioPessoa id={id} />

        {eventos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Eventos que participou
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {eventos.map((evento) => (
                <li
                  key={evento.id}
                  className="bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
                >
                  <div className="font-medium">{evento.nome}</div>
                  <div className="text-gray-500">
                    {new Date(evento.data).toLocaleDateString('pt-BR')}
                    {evento.local && ` — ${evento.local}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AdminLayout>
    </RequireAdmin>
  )
}
