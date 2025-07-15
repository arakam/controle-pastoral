'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserCheck } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'

interface Pessoa {
  nome: string
  telefone: string
}

interface Checkin {
  id: string
  data_hora: string
  pessoa: Pessoa
}

export default function ListaCheckinsPorEvento() {
  const { id: eventoId } = useParams()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    const buscarCheckins = async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('id, data_hora, pessoa: pessoa_id (nome, telefone)')
        .eq('evento_id', eventoId)
        .order('data_hora', { ascending: false })

      if (error) {
        setErro('Erro ao buscar check-ins')
      } else {
        const convertidos = (data || []).map((c: any) => ({
          ...c,
          pessoa: Array.isArray(c.pessoa) ? c.pessoa[0] : c.pessoa
        }))
        setCheckins(convertidos)

      }
    }

    buscarCheckins()
  }, [eventoId])

  return (
    <RequireAdmin>
      <AdminLayout>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Check-ins do Evento</h1>
          </div>
          <div className="text-sm bg-green-100 text-green-700 px-4 py-1 rounded-full shadow-sm font-medium">
            Total: {checkins.length}
          </div>
        </div>


        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        {checkins.length === 0 ? (
          <p className="text-gray-600 text-sm">Nenhum check-in registrado ainda.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {checkins.map((c) => (
              <li
                key={c.id}
                className="bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow transition"
              >
                <h3 className="text-lg font-semibold text-gray-800  text-gray-800">{c.pessoa.nome}</h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  📞 {c.pessoa.telefone}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  📅 {new Date(c.data_hora).toLocaleString('pt-BR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminLayout>
    </RequireAdmin>
  )
}
