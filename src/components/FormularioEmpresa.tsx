'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'
import ImageUpload from './ImageUpload'
import StorageTest from './StorageTest'

type Pessoa = {
  id: string
  nome: string
  email?: string
  telefone?: string
}

interface Props {
  id?: string
}

export default function FormularioEmpresa({ id }: Props) {
  const { supabase } = useSupabase()
  const router = useRouter()

  const [form, setForm] = useState<{
    nome: string
    segmento: string
    cidade: string
    telefone: string
    whatsapp: string
    email: string
    site?: string
    instagram?: string
    descricao: string
    pessoa_id: string | null
  }>({
    nome: '',
    segmento: '',
    cidade: '',
    telefone: '',
    whatsapp: '',
    email: '',
    site: '',
    instagram: '',
    descricao: '',
    pessoa_id: null,
  })

  const [images, setImages] = useState<{ logo?: string; galeria: string[] }>({
    logo: undefined,
    galeria: []
  })

  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [pessoaOriginal, setPessoaOriginal] = useState<Pessoa | null>(null)
  const [pessoasDisponiveis, setPessoasDisponiveis] = useState<Pessoa[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [pessoasFiltradas, setPessoasFiltradas] = useState<Pessoa[]>([])

  useEffect(() => {
    const carregar = async () => {
      if (id) {
        console.log('📦 Modo edição. Carregando empresa com id:', id)

        const { data, error } = await supabase
          .from('empresas')
          .select('nome, segmento, cidade, telefone, whatsapp, email, site, instagram, descricao, pessoa_id, logo, galeria')
          .eq('id', id)
          .single()

        if (error) {
          console.error('❌ Erro ao carregar empresa:', error)
          return
        }

        console.log('✅ Empresa carregada:', data)
        setForm(data)
        
        // Carregar imagens se existirem
        if (data.logo || data.galeria) {
          setImages({
            logo: data.logo || undefined,
            galeria: data.galeria || []
          })
        }

        const { data: pessoa } = await supabase
          .from('pessoas')
          .select('id, nome, email, telefone')
          .eq('id', data.pessoa_id)
          .single()

        console.log('👤 Pessoa vinculada:', pessoa)
        setPessoa(pessoa)
        setPessoaOriginal(pessoa)
        
        // Buscar pessoas disponíveis para vínculo (incluindo a atual)
        const { data: pessoasDisponiveisData, error: pessoasError } = await supabase.rpc('pessoas_sem_empresa')
        
        if (pessoasError) {
          console.error('❌ Erro ao buscar pessoas disponíveis:', pessoasError)
        } else {
          // Adicionar a pessoa atual à lista de disponíveis se não estiver
                  const pessoasComAtual = pessoasDisponiveisData || []
        if (pessoa && !pessoasComAtual.find((p: Pessoa) => p.id === pessoa.id)) {
          pessoasComAtual.push(pessoa)
        }
          
          console.log('✅ Pessoas disponíveis para vínculo:', pessoasComAtual)
          setPessoasDisponiveis(pessoasComAtual)
          setPessoasFiltradas(pessoasComAtual)
        }
        
        setCarregando(false)
      } else {
        console.log('🆕 Modo cadastro. Buscando pessoas sem empresa...')

        const { data, error } = await supabase.rpc('pessoas_sem_empresa')

        if (error) {
          console.error('❌ Erro ao buscar pessoas:', error)
          return
        }

        console.log('✅ Pessoas disponíveis para vínculo:', data)
        setPessoasDisponiveis(data || [])
        setPessoasFiltradas(data || [])
        setPessoa(null)
        setCarregando(false)
      }
    }

    carregar()
  }, [id, supabase])

  // Filtragem em tempo real
  useEffect(() => {
    if (busca.trim() === '') {
      setPessoasFiltradas(pessoasDisponiveis)
      setMostrarDropdown(false)
      return
    }

    const filtradas = pessoasDisponiveis.filter((p) =>
      `${p.nome} ${p.telefone ?? ''} ${p.email ?? ''}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    )
    setPessoasFiltradas(filtradas)
    setMostrarDropdown(filtradas.length > 0)
  }, [busca, pessoasDisponiveis])

  const selecionarPessoa = (pessoaSelecionada: Pessoa) => {
    setPessoa(pessoaSelecionada)
    setForm({ ...form, pessoa_id: pessoaSelecionada.id })
    setBusca(pessoaSelecionada.nome)
    setMostrarDropdown(false)
  }

  const limparPessoa = () => {
    setPessoa(null)
    setForm({ ...form, pessoa_id: null })
    setBusca('')
    setMostrarDropdown(false)
  }

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.pessoa-search-container')) {
        setMostrarDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação da pessoa vinculada
    if (!form.pessoa_id) {
      alert('⚠️ Por favor, selecione uma pessoa para vincular à empresa.')
      return
    }

    console.log('📤 Enviando dados do formulário:', form)

    // Preparar dados para salvar incluindo imagens
    const dadosParaSalvar = {
      ...form,
      logo: images.logo,
      galeria: images.galeria
    }

    const { error } = id
      ? await supabase.from('empresas').update(dadosParaSalvar).eq('id', id)
      : await supabase.from('empresas').insert([dadosParaSalvar])

    if (error) {
      console.error('❌ Erro ao salvar empresa:', error.message, error.details)
      return
    }

    console.log('✅ Empresa salva com sucesso')
    router.push('/admin/empresas')
  }

  if (carregando) return <p className="text-center mt-6">Carregando dados...</p>

  return (
    <form onSubmit={salvar} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Pessoa vinculada</label>
        {id && pessoa ? (
          <div className="space-y-3">
            {/* Pessoa atual vinculada */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800 mb-2">👤 Pessoa atualmente vinculada:</div>
              <div className="font-medium text-blue-900">
                {pessoa.nome}
                {pessoa.telefone && ` • ${pessoa.telefone}`}
                {pessoa.email && ` • ${pessoa.email}`}
              </div>
            </div>
            
            {/* Opções para alterar pessoa */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPessoa(null)
                  setForm({ ...form, pessoa_id: null })
                  setBusca('')
                  setMostrarDropdown(false)
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                🔄 Alterar Pessoa Vinculada
              </button>
              
              {pessoaOriginal && pessoaOriginal.id !== pessoa.id && (
                <button
                  type="button"
                  onClick={() => {
                    setPessoa(pessoaOriginal)
                    setForm({ ...form, pessoa_id: pessoaOriginal.id })
                    setBusca('')
                    setMostrarDropdown(false)
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  ↩️ Restaurar Original
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mensagem informativa */}
            {id ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800 mb-2">🔍 Selecionar nova pessoa para vincular:</div>
                  <div className="text-blue-700">Digite no campo abaixo para buscar e selecionar uma pessoa.</div>
                </div>
                
                {/* Botão para restaurar pessoa original */}
                {pessoaOriginal && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPessoa(pessoaOriginal)
                        setForm({ ...form, pessoa_id: pessoaOriginal.id })
                        setBusca('')
                        setMostrarDropdown(false)
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      ↩️ Restaurar Pessoa Original
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-2">👤 Vincular pessoa à empresa:</div>
                <div className="text-green-700">Digite no campo abaixo para buscar e selecionar uma pessoa.</div>
              </div>
            )}
            
            <div className="relative pessoa-search-container">
              <div className="flex gap-2 mb-2">
                               <input
                 type="text"
                 placeholder="🔍 Buscar por nome, telefone ou email..."
                 value={busca}
                 onChange={(e) => setBusca(e.target.value)}
                 onFocus={() => setMostrarDropdown(true)}
                 className="flex-1 border border-gray-400 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
               />
                {pessoa && (
                  <button
                    type="button"
                    onClick={limparPessoa}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Dropdown de resultados */}
              {mostrarDropdown && pessoasFiltradas.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {pessoasFiltradas.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => selecionarPessoa(p)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{p.nome}</div>
                      <div className="text-sm text-gray-600">
                        {p.telefone && `📞 ${p.telefone}`}
                        {p.telefone && p.email && ' • '}
                        {p.email && `✉️ ${p.email}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensagem quando não há resultados */}
              {mostrarDropdown && busca.trim() !== '' && pessoasFiltradas.length === 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  Nenhuma pessoa encontrada para "{busca}"
                </div>
              )}

              {/* Indicador de pessoa selecionada */}
              {pessoa && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">✅ Pessoa selecionada:</div>
                      <div className="text-sm text-green-700">
                        <strong>{pessoa.nome}</strong>
                        {pessoa.telefone && ` • ${pessoa.telefone}`}
                        {pessoa.email && ` • ${pessoa.email}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Validação */}
              {!pessoa && busca.trim() !== '' && (
                <div className="mt-1 text-sm text-red-600">
                  ⚠️ Selecione uma pessoa da lista para continuar
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Campos da empresa */}
      <div>
        <label className="block text-sm font-medium">Nome da Empresa</label>
                 <input
           required
           className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
           value={form.nome}
           onChange={(e) => setForm({ ...form, nome: e.target.value })}
         />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Segmento</label>
                     <input
             className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
             value={form.segmento}
             onChange={(e) => setForm({ ...form, segmento: e.target.value })}
           />
        </div>

        <div>
          <label className="block text-sm font-medium">Cidade</label>
                     <input
             className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
             value={form.cidade}
             onChange={(e) => setForm({ ...form, cidade: e.target.value })}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Telefone</label>
                     <input
             className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
             value={form.telefone}
             onChange={(e) => setForm({ ...form, telefone: e.target.value })}
           />
        </div>

        <div>
          <label className="block text-sm font-medium">WhatsApp</label>
                     <input
             className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
             value={form.whatsapp}
             onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
           />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">E-mail</label>
                 <input
           type="email"
           className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
           value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
         />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Site</label>
          <input
            type="url"
            placeholder="https://exemplo.com"
            className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            value={form.site || ''}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Instagram</label>
          <input
            type="text"
            placeholder="@usuario ou usuario"
            className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            value={form.instagram || ''}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
                 <textarea
           className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
           value={form.descricao}
           onChange={(e) => setForm({ ...form, descricao: e.target.value })}
         />
      </div>

      {/* Upload de Imagens */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Imagens da Empresa</h3>
        
        {/* Componente de teste para diagnóstico */}
        {!id && (
          <div className="mb-6">
            <StorageTest />
          </div>
        )}
        
        <ImageUpload
          empresaId={id || 'temp-' + Date.now()}
          onImagesChange={setImages}
          initialImages={images}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {id ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
      </button>
    </form>
  )
}
