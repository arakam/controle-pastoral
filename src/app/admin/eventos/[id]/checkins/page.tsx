'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Check-ins do Evento</h1>

      {erro && <p className="text-red-500">{erro}</p>}

      {checkins.length === 0 ? (
        <p>Nenhum check-in registrado ainda.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nome</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {checkins.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.pessoa.nome}</td>
                <td className="p-2">{c.pessoa.telefone}</td>
                <td className="p-2">
                  {new Date(c.data_hora).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
