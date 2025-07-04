'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckinPorEvento() {
  const { id: eventoId } = useParams()
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setLoading(true)

    const telefoneLimpo = telefone.replace(/\D/g, '')

    const { data: pessoas, error: erroPessoa } = await supabase
      .from('pessoas')
      .select('*')
      .eq('telefone', telefoneLimpo)
      .limit(1)

    if (erroPessoa) {
      setMensagem('Erro ao buscar pessoa.')
      setLoading(false)
      return
    }

    if (pessoas && pessoas.length > 0) {
      const pessoa = pessoas[0]

      const { error: erroCheckin } = await supabase.from('checkins').insert([
        {
          pessoa_id: pessoa.id,
          evento_id: eventoId,
        },
      ])

      if (erroCheckin) {
        setMensagem(`Erro ao registrar check-in: ${erroCheckin.message}`)
      } else {
        setMensagem(`Check-in realizado com sucesso! Bem-vindo(a), ${pessoa.nome}!`)
      }
    } else {
      setMensagem('Número não encontrado. Redirecionando para cadastro...')
      setTimeout(() => {
        window.location.href = `/cadastro?telefone=${telefoneLimpo}`
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Check-in do Evento</h1>

      <form onSubmit={handleCheckin} className="space-y-4">
        <input
          type="tel"
          placeholder="Digite seu telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Verificando...' : 'Fazer Check-in'}
        </button>
      </form>

      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  )
}
