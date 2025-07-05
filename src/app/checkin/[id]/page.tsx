'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QrCode } from 'lucide-react'

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
      setMensagem('❌ Erro ao buscar pessoa.')
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
        setMensagem(`❌ Erro ao registrar check-in: ${erroCheckin.message}`)
      } else {
        setMensagem(`✅ Check-in realizado com sucesso! Bem-vindo(a), ${pessoa.nome}!`)
      }
    } else {
      setMensagem('⚠️ Número não encontrado. Redirecionando para cadastro...')
      setTimeout(() => {
        window.location.href = `/cadastro?telefone=${telefoneLimpo}`
      }, 2500)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleCheckin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <QrCode className="mx-auto h-10 w-10 text-green-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Check-in do Evento</h1>
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
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="tel"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring focus:ring-green-200"
            placeholder="(41) 99999-9999"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Fazer Check-in'}
        </button>
      </form>
    </div>
  )
}
