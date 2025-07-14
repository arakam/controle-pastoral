'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setCarregando(true)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (authError || !authData.session) {
      setMensagem('❌ E-mail ou senha inválidos.')
      setCarregando(false)
      return
    }

    const { data: pessoas, error: pessoaErro } = await supabase
      .from('pessoas')
      .select('tipo')
      .eq('email', email)
      .limit(1)

    if (pessoaErro || !pessoas || pessoas.length === 0) {
      setMensagem('❌ Usuário não encontrado na base.')
      setCarregando(false)
      return
    }

    const tipo = pessoas[0].tipo

    if (tipo === 'administrador') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }

    setCarregando(false)
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
            disabled={carregando}
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800 disabled:opacity-50 flex justify-center items-center gap-2"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 20v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
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
