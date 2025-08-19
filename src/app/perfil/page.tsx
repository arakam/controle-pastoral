'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { useSupabase } from '@/components/SupabaseProvider'
import { toast } from 'sonner'
import { Building2, Edit } from 'lucide-react'

export default function Perfil() {
  const { supabase, session } = useSupabase()
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [empresaVinculada, setEmpresaVinculada] = useState<{
    id: string
    nome: string
    segmento?: string
    cidade?: string
  } | null>(null)

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true)

      // Buscar dados da pessoa
      const { data: pessoa, error } = await supabase
        .from('pessoas')
        .select('id, nome, telefone, email')
        .eq('email', session?.user.email)
        .single()

      if (pessoa) {
        setNome(pessoa.nome || '')
        setTelefone(pessoa.telefone || '')
        setEmail(pessoa.email || '')
        
        // Buscar empresa vinculada à pessoa
        const { data: empresa, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome, segmento, cidade')
          .eq('pessoa_id', pessoa.id)
          .single()

        if (empresa && !empresaError) {
          setEmpresaVinculada(empresa)
        } else {
          setEmpresaVinculada(null)
        }
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

  const editarEmpresa = () => {
    if (empresaVinculada) {
      router.push('/empresas/editar')
    }
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
              <label className="block text-sm text-gray-700 font-medium mb-1">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="41999990000"
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <button
              onClick={salvarPerfil}
              disabled={salvando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm mt-2"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>

            {/* Seção da Empresa Vinculada */}
            {empresaVinculada && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Empresa Vinculada
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-blue-900">{empresaVinculada.nome}</h4>
                      <button
                        onClick={editarEmpresa}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Empresa
                      </button>
                    </div>
                    
                    {empresaVinculada.segmento && (
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Segmento:</span> {empresaVinculada.segmento}
                      </p>
                    )}
                    
                    {empresaVinculada.cidade && (
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Cidade:</span> {empresaVinculada.cidade}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem quando não há empresa vinculada */}
            {!empresaVinculada && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  Empresa Vinculada
                </h3>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Você não possui uma empresa vinculada ao seu perfil.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Entre em contato com um administrador para vincular uma empresa.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ParticipanteLayout>
  )
}
