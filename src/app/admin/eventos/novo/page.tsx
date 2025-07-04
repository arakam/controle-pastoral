'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovoEvento() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
  const [local, setLocal] = useState('')
  const [vagas, setVagas] = useState(0)
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('eventos').insert([
      {
        nome,
        descricao,
        data,
        local,
        vagas,
      },
    ])

    if (error) {
      setMensagem(`Erro ao cadastrar: ${error.message}`)
    } else {
      setMensagem('Evento cadastrado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push('/admin/eventos')
      }, 2000)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Novo Evento</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do evento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Número de vagas"
          value={vagas}
          onChange={(e) => setVagas(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cadastrar Evento
        </button>
      </form>

      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  )
}
