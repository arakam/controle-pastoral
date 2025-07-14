'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

interface Props {
  id?: string // Se existir, estamos editando  
}

export default function FormularioPessoa({ id }: Props) {
  const { supabase, session } = useSupabase()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
  })

  const router = useRouter()

  useEffect(() => {
    console.log('ID recebido no formulário:', id)

    if (id) {
      supabase
        .from('pessoas')
        .select('nome, telefone, email')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          console.log('Dados carregados:', data)
          if (error) console.error('Erro ao carregar pessoa:', error)
          if (data) setForm(data)
        })
    }
  }, [id, supabase])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const user_id = session?.user.id

    console.log('Sessão do usuário:', session)
    console.log('Dados do formulário:', form)

    if (!user_id) {
      console.warn('Usuário não autenticado.')
      return
    }

    if (id) {
      console.log('Atualizando pessoa com ID:', id)
      const { error } = await supabase
        .from('pessoas')
        .update({ ...form })
        .eq('id', id)

      if (error) {
        console.error('Erro ao atualizar pessoa:', error)
        return
      }

      console.log('Pessoa atualizada com sucesso.')
    } else {
      console.log('Inserindo nova pessoa...')
      const { error } = await supabase
        .from('pessoas')
        .insert([{ ...form, user_id }])

      if (error) {
        console.error('Erro ao inserir pessoa:', error)
        return
      }

      console.log('Pessoa criada com sucesso.')
    }

    router.push('/admin/pessoas')
  }

  return (
    <form onSubmit={salvar} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Telefone</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {id ? 'Atualizar Pessoa' : 'Cadastrar Pessoa'}
      </button>
    </form>
  )
}
