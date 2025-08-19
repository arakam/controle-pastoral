'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { Phone, Mail, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, X, Globe, Instagram } from 'lucide-react'
import { useSupabase } from '@/components/SupabaseProvider'

interface Empresa {
  id: string
  nome: string
  descricao: string
  telefone: string
  whatsapp: string
  email: string
  site?: string
  instagram?: string
  segmento?: string
  cidade?: string
  logo?: string
  galeria?: string[]
}

export default function DetalhesEmpresa() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { supabase } = useSupabase()
  
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [imagemAtual, setImagemAtual] = useState(0)
  const [mostrarGaleria, setMostrarGaleria] = useState(false)

  useEffect(() => {
    const carregarEmpresa = async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao carregar empresa:', error)
        return
      }

      setEmpresa(data)
      setCarregando(false)
    }

    carregarEmpresa()
  }, [id, supabase])

  const proximaImagem = () => {
    if (empresa?.galeria) {
      setImagemAtual((prev) => 
        prev === empresa.galeria!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const imagemAnterior = () => {
    if (empresa?.galeria) {
      setImagemAtual((prev) => 
        prev === 0 ? empresa.galeria!.length - 1 : prev - 1
      )
    }
  }

  const abrirGaleria = () => {
    setMostrarGaleria(true)
    setImagemAtual(0)
  }

  const fecharGaleria = () => {
    setMostrarGaleria(false)
  }

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mostrarGaleria) return
      
      switch (e.key) {
        case 'ArrowLeft':
          imagemAnterior()
          break
        case 'ArrowRight':
          proximaImagem()
          break
        case 'Escape':
          fecharGaleria()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mostrarGaleria])

  if (carregando) {
    return (
      <ParticipanteLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando empresa...</p>
          </div>
        </div>
      </ParticipanteLayout>
    )
  }

  if (!empresa) {
    return (
      <ParticipanteLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Empresa não encontrada</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </ParticipanteLayout>
    )
  }

  return (
    <ParticipanteLayout>
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4 mb-6 px-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{empresa.nome}</h1>
      </div>

      <div className="px-2">
        {/* Card principal da empresa */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo da empresa */}
            <div className="flex-shrink-0">
              {empresa.logo ? (
                <img 
                  src={empresa.logo} 
                  alt={`Logo ${empresa.nome}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <span className="text-gray-400 text-center">Sem Logo</span>
                </div>
              )}
            </div>

            {/* Informações da empresa */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{empresa.nome}</h2>
              <p className="text-gray-600 mb-4 text-lg">{empresa.descricao}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {empresa.segmento && (
                  <div>
                    <span className="text-sm text-gray-500">Segmento:</span>
                    <p className="font-medium">{empresa.segmento}</p>
                  </div>
                )}
                {empresa.cidade && (
                  <div>
                    <span className="text-sm text-gray-500">Cidade:</span>
                    <p className="font-medium">{empresa.cidade}</p>
                  </div>
                )}
              </div>

              {/* Botões de contato */}
              <div className="flex gap-3 flex-wrap">
                {empresa.telefone && (
                  <a
                    href={`tel:${empresa.telefone}`}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                    title={`Ligar para ${empresa.telefone}`}
                  >
                    <Phone size={18} />
                  </a>
                )}
                {empresa.whatsapp && (
                  <a
                    href={`https://wa.me/55${empresa.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                    title="Abrir WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                )}
                {empresa.email && (
                  <a
                    href={`mailto:${empresa.email}`}
                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                    title="Enviar e-mail"
                  >
                    <Mail size={18} />
                  </a>
                )}
                {empresa.site && (
                  <a
                    href={empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
                    title="Visitar site"
                  >
                    <Globe size={18} />
                  </a>
                )}
                {empresa.instagram && (
                  <a
                    href={`https://instagram.com/${empresa.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
                    title="Ver Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de imagens */}
        {empresa.galeria && empresa.galeria.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Galeria de Imagens ({empresa.galeria.length})
              </h3>
              <button
                onClick={abrirGaleria}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ver Galeria Completa
              </button>
            </div>

            {/* Preview da primeira imagem */}
            <div className="relative">
              <img
                src={empresa.galeria[0]}
                alt={`Imagem da ${empresa.nome}`}
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onClick={abrirGaleria}
              />
              {empresa.galeria.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  +{empresa.galeria.length - 1} mais
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal da galeria */}
      {mostrarGaleria && empresa.galeria && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Botão fechar */}
            <button
              onClick={fecharGaleria}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>

            {/* Imagem atual */}
            <img
              src={empresa.galeria[imagemAtual]}
              alt={`Imagem ${imagemAtual + 1} da ${empresa.nome}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navegação */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={imagemAnterior}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={proximaImagem}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Indicador de posição */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {imagemAtual + 1} de {empresa.galeria.length}
            </div>
          </div>
        </div>
      )}
    </ParticipanteLayout>
  )
}
