'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserCheck } from 'lucide-react'

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
        setCheckins(data as Checkin[])
      }
    }

    buscarCheckins()
  }, [eventoId])

  return (
  <div className="min-h-screen bg-gray-50 px-4 py-10">
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Check-ins do Evento</h1>
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
              <h3 className="text-lg font-semibold text-gray-800">{c.pessoa.nome}</h3>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h2l.4 2M7 4h10l1 2m2 4H4m3 4h10m-6 4h6m-9-1v2a2 2 0 002 2h6a2 2 0 002-2v-2"
                  />
                </svg>
                {c.pessoa.telefone}
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                📅 {new Date(c.data_hora).toLocaleString('pt-BR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)

}
