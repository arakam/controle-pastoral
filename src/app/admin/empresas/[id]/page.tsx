'use client'

import { useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import FormularioEmpresa from '@/components/FormularioEmpresa'

export default function EditarEmpresaPage() {
  const { id } = useParams() as { id: string }

  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold text-gray-800  mb-4">Editar Empresa</h1>
        <FormularioEmpresa id={id} />
      </AdminLayout>
    </RequireAdmin>
  )
}
