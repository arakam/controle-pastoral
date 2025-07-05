'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserPlus } from 'lucide-react'

export default function CadastroParticipante() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const tel = searchParams.get('telefone')
    if (tel) setTelefone(tel)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setCarregando(true)

    const telefoneLimpo = telefone.replace(/\D/g, '')

    const { error } = await supabase.from('pessoas').insert([
      {
        nome,
        telefone: telefoneLimpo,
        email,
        tipo: 'participante',
      },
    ])

    if (error) {
      setMensagem(`❌ Erro: ${error.message}`)
    } else {
      setMensagem('✅ Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }

    setCarregando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Cadastro de Participante</h1>
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
          <label className="block text-sm font-medium text-gray-700">Nome completo</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            placeholder="Ex: Ana Beatriz da Silva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="tel"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            placeholder="(41) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email (opcional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}
