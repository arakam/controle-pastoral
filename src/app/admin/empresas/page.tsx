'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Mail, MessageSquare, Edit, Plus, Trash2, Globe, Instagram } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import { useSupabase } from '@/components/SupabaseProvider'

interface Empresa {
  id: string
  nome: string
  descricao?: string
  telefone?: string
  whatsapp?: string
  email?: string
  site?: string
  instagram?: string
  segmento?: string
  cidade?: string
  logo?: string
  galeria?: string[]
}

export default function ListaEmpresas() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  const carregarEmpresas = async () => {
    const { data, error } = await supabase
      .from('empresas')
      .select('id, nome, descricao, telefone, whatsapp, email, site, instagram, segmento, cidade, logo, galeria')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar empresas:', error)
    } else {
      setEmpresas(data || [])
    }
  }

  const excluirEmpresa = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a empresa "${nome}"?\n\n⚠️  ATENÇÃO: Esta ação não pode ser desfeita!\n\nSerão removidos permanentemente:\n• Todos os dados da empresa\n• Logo e imagens da galeria\n• Histórico de relacionamentos\n\nDigite "EXCLUIR" para confirmar:`)) {
      return
    }

    const confirmacao = prompt('Digite "EXCLUIR" para confirmar a exclusão:')
    if (confirmacao !== 'EXCLUIR') {
      alert('Exclusão cancelada.')
      return
    }

    try {
      // Primeiro, vamos buscar as imagens para deletar do storage
      const { data: empresa } = await supabase
        .from('empresas')
        .select('logo, galeria')
        .eq('id', id)
        .single()

      if (empresa) {
        // Deletar logo se existir
        if (empresa.logo) {
          try {
            const logoPath = empresa.logo.split('/').pop()
            if (logoPath) {
              await supabase.storage
                .from('empresa-images')
                .remove([logoPath])
            }
          } catch (storageError) {
            console.warn('Erro ao deletar logo do storage:', storageError)
            // Continua mesmo se falhar ao deletar do storage
          }
        }

        // Deletar imagens da galeria se existirem
        if (empresa.galeria && empresa.galeria.length > 0) {
          try {
            const galeriaPaths = empresa.galeria.map((url: string) => url.split('/').pop()).filter(Boolean)
            if (galeriaPaths.length > 0) {
              await supabase.storage
                .from('empresa-images')
                .remove(galeriaPaths)
            }
          } catch (storageError) {
            console.warn('Erro ao deletar galeria do storage:', storageError)
            // Continua mesmo se falhar ao deletar do storage
          }
        }
      }

      // Agora deletar a empresa do banco
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id)

      if (error) {
        alert(`Erro ao excluir empresa: ${error.message}`)
        return
      }

      // Recarregar a lista
      carregarEmpresas()
      alert(`✅ Empresa "${nome}" excluída com sucesso!`)
    } catch (error) {
      console.error('Erro ao excluir empresa:', error)
      alert('❌ Erro ao excluir empresa. Tente novamente.')
    }
  }

  useEffect(() => {
    carregarEmpresas()
  }, [supabase])

  return (
    <RequireAdmin>
      <AdminLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 text-blue-700">
            Empresas Cadastradas
          </h1>
          <button
            onClick={() => router.push('/admin/empresas/nova')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Nova Empresa
          </button>
        </div>

        <div className="space-y-4">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Logo da empresa */}
                <div className="flex-shrink-0">
                  {empresa.logo ? (
                    <img 
                      src={empresa.logo} 
                      alt={`Logo ${empresa.nome}`}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center">Sem Logo</span>
                    </div>
                  )}
                </div>

                {/* Informações da empresa */}
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 text-base mb-1">
                    {empresa.nome}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {empresa.descricao || 'Sem descrição'}
                  </p>
                  
                  {/* Informações adicionais */}
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    {empresa.segmento && (
                      <span>📊 {empresa.segmento}</span>
                    )}
                    {empresa.cidade && (
                      <span>📍 {empresa.cidade}</span>
                    )}
                    {empresa.galeria && empresa.galeria.length > 0 && (
                      <span>📸 {empresa.galeria.length} foto{empresa.galeria.length > 1 ? 's' : ''}</span>
                    )}
                  </div>

                  {/* Botões de contato */}
                  <div className="flex gap-2">
                    {empresa.telefone && (
                      <a
                        href={`tel:${empresa.telefone}`}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        title={`Ligar para ${empresa.telefone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    {empresa.whatsapp && (
                      <a
                        href={`https://wa.me/55${empresa.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}
                    {empresa.email && (
                      <a
                        href={`mailto:${empresa.email}`}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        title="Enviar e-mail"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {empresa.site && (
                      <a
                        href={empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                        title="Visitar site"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {empresa.instagram && (
                      <a
                        href={`https://instagram.com/${empresa.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                        title="Ver Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => router.push(`/admin/empresas/${empresa.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
                  title="Editar empresa"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => excluirEmpresa(empresa.id, empresa.nome)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
                  title="Excluir empresa"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </RequireAdmin>
  )
}
