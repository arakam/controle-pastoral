	'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CheckinPage() {
  const router = useRouter()

  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setLoading(true)

    const { data: pessoas, error } = await supabase
      .from('pessoas')
      .select('*')
      .eq('telefone', telefone.replace(/\D/g, ''))
      .limit(1)

    if (error) {
      setMensagem('Erro ao buscar pessoa.')
      setLoading(false)
      return
    }

	console.log('Buscando telefone:', pessoas.length)

    if (pessoas && pessoas.length > 0) {
      const pessoa = pessoas[0]

      // Aqui você pode ajustar para vincular com o ID do evento atual se quiser
      const { error: checkinError } = await supabase.from('checkins').insert([
        {
          pessoa_id: pessoa.id,
          evento_id: null, // depois vamos ajustar para identificar o evento
        },
      ])

      if (checkinError) {
        setMensagem(`Erro ao registrar check-in: ${checkinError.message}`)
      } else {
        setMensagem(`Check-in realizado com sucesso! Bem-vindo(a), ${pessoa.nome}!`)
      }
    } else {
      setMensagem('Número não encontrado. Redirecionando para cadastro...')
      setTimeout(() => {
        router.push(`/cadastro?telefone=${telefone}`)
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Check-in</h1>

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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Fazer Check-in'}
        </button>
      </form>

      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  )
}
