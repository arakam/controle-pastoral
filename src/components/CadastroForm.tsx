'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserPlus } from 'lucide-react'

export default function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const tel = searchParams.get('telefone')
    if (tel) setTelefone(formatarTelefone(tel))
  }, [searchParams])

  const formatarTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  const validarEmail = (email: string) => {
    const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setCarregando(true)

    const telefoneLimpo = telefone.replace(/\D/g, '')

    if (!nome || !telefoneLimpo || !email) {
      setMensagem('❌ Todos os campos são obrigatórios.')
      setCarregando(false)
      return
    }

    if (!validarEmail(email)) {
      setMensagem('❌ E-mail inválido.')
      setCarregando(false)
      return
    }

    const { error } = await supabase.from('pessoas').insert([{
      nome,
      telefone: telefoneLimpo,
      email,
      tipo: 'participante',
    }])

    if (error) {
      setMensagem(`❌ Erro: ${error.message}`)
    } else {
      setMensagem('✅ Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(() => router.push('/'), 2000)
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
              mensagem.includes('✅') ? 'text-green-600' :
              mensagem.includes('❌') ? 'text-red-600' :
              'text-yellow-600'
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
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            placeholder="(41) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {carregando ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 20v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Enviando...
            </>
          ) : (
            'Cadastrar'
          )}
        </button>
      </form>
    </div>
  )
}
