'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserRound, Phone, Mail, Plus, Pencil, Search } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import RequireAdmin from '@/components/RequireAdmin'
import AdminLayout from '@/components/AdminLayout'
import { useSupabase } from '@/components/SupabaseProvider'

interface Pessoa {
  id: string
  nome: string
  telefone?: string
  email?: string
}

export default function ListaPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const { session } = useSupabase()

  useEffect(() => {
    const buscarPessoas = async () => {
      let query = supabase
        .from('pessoas')
        .select('id, nome, telefone, email')
        .order('nome', { ascending: true })

      if (busca.trim() !== '') {
        query = query.or(
          `nome.ilike.%${busca}%,email.ilike.%${busca}%,telefone.ilike.%${busca}%`
        )
      }

      const { data, error } = await query

      if (error) setErro('Erro ao buscar pessoas')
      else setPessoas(data as Pessoa[])
    }

    buscarPessoas()
  }, [busca])

  return (
    <RequireAdmin>
      <AdminLayout>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800  flex items-center gap-2">
            <UserRound className="w-5 h-5 text-blue-600" />
            Pessoas Cadastradas
          </h2>

          <Link
            href="/admin/pessoas/nova"
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Pessoa
          </Link>
        </div>

        {/* Campo de busca */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou e-mail"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-sm"
          />
        </div>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <ul className="grid gap-4">
          {pessoas.map((pessoa) => (
            <li
              key={pessoa.id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800  text-gray-800">{pessoa.nome}</h3>
                <Link
                  href={`/admin/pessoas/${pessoa.id}`}
                  className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Link>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {pessoa.telefone || 'Sem telefone'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {pessoa.email || 'Sem e-mail'}
              </p>
            </li>
          ))}
        </ul>
      </AdminLayout>
    </RequireAdmin>
  )
}
