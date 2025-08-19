'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { useSupabase } from '@/components/SupabaseProvider'
import { toast } from 'sonner'
import { Building2, ArrowLeft } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

interface Empresa {
  id: string
  nome: string
  segmento: string
  cidade: string
  telefone: string
  whatsapp: string
  email: string
  site?: string
  instagram?: string
  descricao: string
  logo?: string
  galeria?: string[]
}

export default function EditarEmpresa() {
  const { supabase, session } = useSupabase()
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [images, setImages] = useState<{ logo?: string; galeria: string[] }>({
    logo: undefined,
    galeria: []
  })

  useEffect(() => {
    const carregarEmpresa = async () => {
      if (!session?.user?.email) {
        router.push('/login')
        return
      }

      setCarregando(true)

      try {
        // Primeiro, buscar a pessoa pelo email
        const { data: pessoa, error: pessoaError } = await supabase
          .from('pessoas')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (pessoaError || !pessoa) {
          toast.error('Usuário não encontrado')
          router.push('/perfil')
          return
        }

        // Buscar a empresa vinculada à pessoa
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome, segmento, cidade, telefone, whatsapp, email, site, instagram, descricao, logo, galeria')
          .eq('pessoa_id', pessoa.id)
          .single()

        if (empresaError || !empresaData) {
          toast.error('Nenhuma empresa vinculada ao seu perfil')
          router.push('/perfil')
          return
        }

        setEmpresa(empresaData)
        
        // Carregar imagens se existirem
        if (empresaData.logo || empresaData.galeria) {
          setImages({
            logo: empresaData.logo || undefined,
            galeria: empresaData.galeria || []
          })
        }

      } catch (error) {
        console.error('Erro ao carregar empresa:', error)
        toast.error('Erro ao carregar dados da empresa')
        router.push('/perfil')
      } finally {
        setCarregando(false)
      }
    }

    carregarEmpresa()
  }, [session, supabase, router])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!empresa) return

    setSalvando(true)

    try {
      // Preparar dados para salvar incluindo imagens
      const dadosParaSalvar = {
        ...empresa,
        logo: images.logo,
        galeria: images.galeria
      }

      const { error } = await supabase
        .from('empresas')
        .update(dadosParaSalvar)
        .eq('id', empresa.id)

      if (error) {
        console.error('Erro ao salvar empresa:', error)
        toast.error('Erro ao salvar alterações')
        return
      }

      toast.success('Empresa atualizada com sucesso!')
      router.push('/perfil')
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
      toast.error('Erro ao salvar alterações')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <ParticipanteLayout>
        <div className="p-4 text-center">
          <p className="text-gray-500">Carregando empresa...</p>
        </div>
      </ParticipanteLayout>
    )
  }

  if (!empresa) {
    return (
      <ParticipanteLayout>
        <div className="p-4 text-center">
          <p className="text-red-500">Empresa não encontrada</p>
        </div>
      </ParticipanteLayout>
    )
  }

  return (
    <ParticipanteLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/perfil')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Editar Empresa
            </h1>
            <p className="text-gray-600 text-sm">Atualize os dados da sua empresa</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              required
              value={empresa.nome}
              onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segmento
              </label>
              <input
                type="text"
                value={empresa.segmento}
                onChange={(e) => setEmpresa({ ...empresa, segmento: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={empresa.cidade}
                onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={empresa.telefone}
                onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                value={empresa.whatsapp}
                onChange={(e) => setEmpresa({ ...empresa, whatsapp: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={empresa.email}
              onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com"
                value={empresa.site || ''}
                onChange={(e) => setEmpresa({ ...empresa, site: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                placeholder="@usuario ou usuario"
                value={empresa.instagram || ''}
                onChange={(e) => setEmpresa({ ...empresa, instagram: e.target.value })}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={empresa.descricao}
              onChange={(e) => setEmpresa({ ...empresa, descricao: e.target.value })}
              rows={4}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Upload de Imagens */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Imagens da Empresa</h3>
            <ImageUpload
              empresaId={empresa.id}
              onImagesChange={setImages}
              initialImages={images}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/perfil')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </ParticipanteLayout>
  )
}
