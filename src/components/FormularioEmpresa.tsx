'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

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
    descricao: string
    pessoa_id: string | null
  }>({
    nome: '',
    segmento: '',
    cidade: '',
    telefone: '',
    whatsapp: '',
    email: '',
    descricao: '',
    pessoa_id: null,
  })

  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [pessoasDisponiveis, setPessoasDisponiveis] = useState<Pessoa[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      if (id) {
        console.log('📦 Modo edição. Carregando empresa com id:', id)

        const { data, error } = await supabase
          .from('empresas')
          .select('nome, segmento, cidade, telefone, whatsapp, email, descricao, pessoa_id')
          .eq('id', id)
          .single()

        if (error) {
          console.error('❌ Erro ao carregar empresa:', error)
          return
        }

        console.log('✅ Empresa carregada:', data)
        setForm(data)

        const { data: pessoa } = await supabase
          .from('pessoas')
          .select('id, nome, email, telefone')
          .eq('id', data.pessoa_id)
          .single()

        console.log('👤 Pessoa vinculada:', pessoa)
        setPessoa(pessoa)
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
        setPessoa(null)
        setCarregando(false)
      }
    }

    carregar()
  }, [id, supabase])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('📤 Enviando dados do formulário:', form)

    const { error } = id
      ? await supabase.from('empresas').update(form).eq('id', id)
      : await supabase.from('empresas').insert([form])

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
        {id ? (
          <input
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={
              pessoa?.nome +
              (pessoa?.telefone ? ` - ${pessoa.telefone}` : '') +
              (pessoa?.email ? ` (${pessoa.email})` : '')
            }
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Buscar por nome ou telefone"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2 text-sm"
            />

            <select
              required
              className="w-full border rounded px-3 py-2"
              value={form.pessoa_id ?? ''}
              onChange={(e) =>
                setForm({ ...form, pessoa_id: e.target.value || null })
              }
            >
              <option value="">Selecione uma pessoa</option>
              {pessoasDisponiveis
                .filter((p) =>
                  `${p.nome} ${p.telefone ?? ''}`
                    .toLowerCase()
                    .includes(busca.toLowerCase())
                )
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} {p.telefone ? `- ${p.telefone}` : ''}
                  </option>
                ))}
            </select>
          </>
        )}
      </div>

      {/* Campos da empresa */}
      <div>
        <label className="block text-sm font-medium">Nome da Empresa</label>
        <input
          required
          className="w-full border rounded px-3 py-2"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Segmento</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.segmento}
            onChange={(e) => setForm({ ...form, segmento: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cidade</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">WhatsApp</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
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
