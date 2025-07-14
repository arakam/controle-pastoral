'use client'

import { useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import FormularioPessoa from '@/components/FormularioPessoa'

export default function EditarPessoaPage() {
  const { id } = useParams() as { id: string }

  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold text-gray-800  mb-4">Editar Pessoa</h1>
        <FormularioPessoa id={id} />
      </AdminLayout>
    </RequireAdmin>
  )
}
