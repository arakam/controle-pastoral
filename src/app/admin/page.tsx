'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  UserRound,
  Building2,
  Plus,
} from 'lucide-react'

import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import { useSupabase } from '@/components/SupabaseProvider'

export default function AdminHome() {
  const { supabase, session } = useSupabase()
  const [totalPessoas, setTotalPessoas] = useState(0)
  const [totalEmpresas, setTotalEmpresas] = useState(0)
  const [proximosEventos, setProximosEventos] = useState<any[]>([])

  useEffect(() => {
    const carregarDados = async () => {
      const [{ count: pessoasCount }, { count: empresasCount }, { data: eventos }] = await Promise.all([
        supabase.from('pessoas').select('*', { count: 'exact', head: true }),
        supabase.from('empresas').select('*', { count: 'exact', head: true }),
        supabase.from('eventos').select('id, nome, data, local')
          .gte('data', new Date().toISOString())
          .order('data', { ascending: true })
          .limit(3),
      ])

      setTotalPessoas(pessoasCount || 0)
      setTotalEmpresas(empresasCount || 0)
      setProximosEventos(eventos || [])
    }

    carregarDados()
  }, [supabase])

  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Olá, {session?.user?.email}! 👋
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link href="/admin/eventos" className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border hover:shadow-md">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Eventos futuros</p>
              <p className="text-lg font-bold text-gray-800">{proximosEventos.length}</p>
            </div>
          </Link>

          <Link href="/admin/pessoas" className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border hover:shadow-md">
            <UserRound className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Pessoas cadastradas</p>
              <p className="text-lg font-bold text-gray-800">{totalPessoas}</p>
            </div>
          </Link>

          <Link href="/admin/empresas" className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border hover:shadow-md">
            <Building2 className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Empresas cadastradas</p>
              <p className="text-lg font-bold text-gray-800">{totalEmpresas}</p>
            </div>
          </Link>
        </div>

        {/* Próximos eventos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Próximos eventos</h2>
          <ul className="space-y-2">
            {proximosEventos.map(evento => (
              <li key={evento.id} className="bg-white p-4 rounded-xl shadow border">
                <p className="font-bold text-gray-800">{evento.nome}</p>
                <p className="text-sm text-gray-500">{new Date(evento.data).toLocaleDateString()} - {evento.local}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Ações rápidas */}
        <div className="flex gap-4 mt-4">
          <Link href="/admin/eventos/novo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Evento
          </Link>
          <Link href="/admin/pessoas/nova" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nova Pessoa
          </Link>
          <Link href="/admin/empresas/nova" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nova Empresa
          </Link>
        </div>
      </AdminLayout>
    </RequireAdmin>
  )
}
