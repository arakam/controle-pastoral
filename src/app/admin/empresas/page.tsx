'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, MessageSquare, Info } from 'lucide-react'
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
}

export default function ListaEmpresas() {
  const { supabase } = useSupabase()
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    const carregarEmpresas = async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, descricao, telefone, whatsapp, email')
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar empresas:', error)
      } else {
        setEmpresas(data || [])
      }
    }

    carregarEmpresas()
  }, [supabase])

  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-center text-xl font-bold text-gray-800  text-blue-700 mb-6">
          Empresas Cadastradas
        </h1>

        <div className="space-y-4">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800  text-base text-gray-800">
                  {empresa.nome}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {empresa.descricao || 'Sem descrição'}
                </p>
                <div className="flex gap-2">
                  {empresa.telefone && (
                    <a
                      href={`tel:${empresa.telefone}`}
                      className="bg-blue-600 text-white p-2 rounded-lg"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {empresa.whatsapp && (
                    <a
                      href={`https://wa.me/${empresa.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white p-2 rounded-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                  {empresa.email && (
                    <a
                      href={`mailto:${empresa.email}`}
                      className="bg-blue-600 text-white p-2 rounded-lg"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Espaço reservado para imagem ou ícone */}
              <div className="ml-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </RequireAdmin>
  )
}
