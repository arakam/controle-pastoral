'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { Phone, Mail, MessageCircle, Filter, X } from 'lucide-react'
import { useSupabase } from '@/components/SupabaseProvider'

interface Empresa {
  id: string
  nome: string
  descricao: string
  telefone: string
  whatsapp: string
  email: string
  segmento?: string
  cidade?: string
  logo?: string
  galeria?: string[]
}

export default function Empresas() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  const [nomeFiltro, setNomeFiltro] = useState('')
  const [segmentoFiltro, setSegmentoFiltro] = useState('')
  const [cidadeFiltro, setCidadeFiltro] = useState('')

  const [mostrarAvancado, setMostrarAvancado] = useState(false)

  const carregarEmpresas = async () => {
    let query = supabase
      .from('empresas')
      .select('id, nome, descricao, telefone, whatsapp, email, segmento, cidade, logo, galeria')
      .order('nome', { ascending: true })

    if (nomeFiltro) {
      query = query.ilike('nome', `%${nomeFiltro}%`)
    }
    if (segmentoFiltro) {
      query = query.ilike('segmento', `%${segmentoFiltro}%`)
    }
    if (cidadeFiltro) {
      query = query.ilike('cidade', `%${cidadeFiltro}%`)
    }

    const { data, error } = await query
    if (!error && data) {
      setEmpresas(data as Empresa[])
    }
  }

  useEffect(() => {
    carregarEmpresas()
  }, [])

  const aplicarFiltros = () => {
    carregarEmpresas()
    setMostrarAvancado(false)
  }

  const limparFiltros = () => {
    setNomeFiltro('')
    setSegmentoFiltro('')
    setCidadeFiltro('')
    carregarEmpresas()
    setMostrarAvancado(false)
  }

  return (
    <ParticipanteLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center text-blue-800">Empresas Cadastradas</h1>

      {/* Barra de filtros principais */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={nomeFiltro}
          onChange={(e) => setNomeFiltro(e.target.value)}
          className="flex-1 border border-gray-400 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        />
        <button
          onClick={() => setMostrarAvancado((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-1"
        >
          {mostrarAvancado ? <X size={16} /> : <Filter size={16} />}
        </button>
      </div>

      {/* Filtros avançados com animação */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          mostrarAvancado ? 'max-h-screen mb-4' : 'max-h-0'
        }`}
      >
        <div className="bg-white p-4 rounded-xl shadow space-y-4 mx-2">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Segmento</label>
            <input
              type="text"
              value={segmentoFiltro}
              onChange={(e) => setSegmentoFiltro(e.target.value)}
              placeholder="Ex: Contabilidade, Eventos"
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Cidade</label>
            <input
              type="text"
              value={cidadeFiltro}
              onChange={(e) => setCidadeFiltro(e.target.value)}
              placeholder="Ex: Curitiba"
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={aplicarFiltros}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={limparFiltros}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de empresas */}
      <div className="grid gap-6 px-2">
        {empresas.length === 0 && (
          <p className="text-center text-gray-500 text-sm">Nenhuma empresa encontrada.</p>
        )}
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => router.push(`/empresas/${empresa.id}`)}
          >
            <div className="flex items-start gap-4">
              {/* Logo da empresa */}
              <div className="flex-shrink-0">
                {empresa.logo ? (
                  <img 
                    src={empresa.logo} 
                    alt={`Logo ${empresa.nome}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center">Sem Logo</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{empresa.nome}</h2>
                <p className="text-gray-600 mt-1">{empresa.descricao}</p>
                <div className="mt-1 text-sm text-gray-500 italic">
                  {empresa.segmento && <span>Segmento: {empresa.segmento}</span>}
                  {empresa.cidade && <span className="ml-2">| Cidade: {empresa.cidade}</span>}
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {empresa.telefone && (
                    <a
                      href={`tel:${empresa.telefone}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
                    >
                      <Phone size={16} />
                      {empresa.telefone}
                    </a>
                  )}
                  {empresa.whatsapp && (
                    <a
                      href={`https://wa.me/55${empresa.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-green-700"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  )}
                  {empresa.email && (
                    <a
                      href={`mailto:${empresa.email}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Indicador de galeria */}
            {empresa.galeria && empresa.galeria.length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                📸 {empresa.galeria.length} foto{empresa.galeria.length > 1 ? 's' : ''} disponível{empresa.galeria.length > 1 ? 'is' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
      

    </ParticipanteLayout>
  )
}
