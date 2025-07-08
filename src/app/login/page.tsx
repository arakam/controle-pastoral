'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })
    if (error) setMensagem('Credenciais inválidas')
    else router.push('/admin/eventos')
  }

  return (
    <div className="min-h-screen bg-[#e6f0f7] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 space-y-6 text-center">
        {/* Logos */}
        <div className="flex justify-between items-center mb-4">
          <img src="/pastoral.jpg" alt="Pastoral do Empreendedor" className="h-12" />
          <img src="/paroquia.jpg" alt="Paróquia Visitação" className="h-12" />
        </div>

        {/* Mensagem de boas-vindas */}
        <p className="text-lg font-semibold text-blue-900">
          Seja um membro da nossa pastoral e faça parte dessa jornada de propósitos.
        </p>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-sm text-gray-600">Login</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="text-left">
            <label className="text-sm text-gray-600">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => router.push('/cadastro')}
            className="w-full border border-blue-700 text-blue-700 py-2 rounded-md hover:bg-blue-50"
          >
            Cadastrar-se
          </button>
        </form>

        {mensagem && <p className="text-red-600 text-sm">{mensagem}</p>}

        {/* Rodapé bíblico */}
        <p className="text-sm italic text-gray-600 mt-6">
          Consagre ao Senhor tudo o que você faz,<br />
          e os seus planos serão bem-sucedidos. <br />
          <span className="font-medium">Provérbios 16:3</span>
        </p>
      </div>
    </div>
  )
}
