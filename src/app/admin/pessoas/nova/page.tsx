'use client'

import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import FormularioPessoa from '@/components/FormularioPessoa'

export default function NovaPessoaPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold mb-4">Cadastrar Nova Pessoa</h1>
        <FormularioPessoa />
      </AdminLayout>
    </RequireAdmin>
  )
}
