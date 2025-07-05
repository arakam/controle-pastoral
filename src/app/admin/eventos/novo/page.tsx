'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CalendarPlus } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ptBR } from 'date-fns/locale'

export default function NovoEvento() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState<Date | null>(null)
  const [local, setLocal] = useState('')
  const [vagas, setVagas] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setCarregando(true)

    const { error } = await supabase.from('eventos').insert([
      {
        nome,
        descricao,
        data: data?.toISOString(),
        local,
        vagas,
      },
    ])

    if (error) {
      setMensagem(`❌ Erro ao cadastrar: ${error.message}`)
    } else {
      setMensagem('✅ Evento cadastrado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push('/admin/eventos')
      }, 2000)
    }

    setCarregando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <CalendarPlus className="mx-auto h-10 w-10 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Novo Evento</h1>
        </div>

        {mensagem && (
          <p
            className={`text-sm text-center ${
              mensagem.includes('✅')
                ? 'text-green-600'
                : mensagem.includes('❌')
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {mensagem}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do evento</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data do evento</label>
          <DatePicker
            selected={data}
            onChange={(date: Date | null) => setData(date)}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Local</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número de vagas</label>
          <input
            type="number"
            value={vagas}
            onChange={(e) => setVagas(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? 'Enviando...' : 'Cadastrar Evento'}
        </button>
      </form>
    </div>
  )
}
