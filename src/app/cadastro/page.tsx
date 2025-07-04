'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CadastroParticipante() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
	
	const telefoneLimpo = telefone.replace(/\D/g, '')

		const { data, error } = await supabase
		  .from('pessoas')
		  .insert([{ nome, telefone: telefoneLimpo, email, tipo: 'participante' }])


    if (error) {
      setMensagem(`Erro: ${error.message}`)
    } else {
      setMensagem('Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Participante</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          placeholder="Telefone (somente números)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>

      {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
    </div>
  )
}
