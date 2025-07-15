'use client'

import { useEffect, useState } from 'react'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { useSupabase } from '@/components/SupabaseProvider'
import { toast } from 'sonner'

export default function Perfil() {
  const { supabase, session } = useSupabase()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true)

      const { data: pessoa, error } = await supabase
        .from('pessoas')
        .select('nome, telefone, email')
        .eq('email', session?.user.email)
        .single()

      if (pessoa) {
        setNome(pessoa.nome || '')
        setTelefone(pessoa.telefone || '')
        setEmail(pessoa.email || '')
      } else {
        toast.error('Erro ao carregar perfil')
      }

      setCarregando(false)
    }

    if (session?.user?.id) {
      buscarDados()
    }
  }, [supabase, session])

  const salvarPerfil = async () => {
    setSalvando(true)
    const { error } = await supabase
      .from('pessoas')
      .update({ nome, telefone, email })
      .eq('email', session?.user.email)
    //   .eq('id', session?.user.id)

    if (error) {
      toast.error('Erro ao salvar perfil')
    } else {
      toast.success('Perfil atualizado com sucesso')
    }

    setSalvando(false)
  }

  return (
    <ParticipanteLayout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">Meu Perfil</h1>

        {carregando ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="41999990000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              onClick={salvarPerfil}
              disabled={salvando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm mt-2"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </>
        )}
      </div>
    </ParticipanteLayout>
  )
}
