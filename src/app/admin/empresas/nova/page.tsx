import AdminLayout from '@/components/AdminLayout'
import RequireAdmin from '@/components/RequireAdmin'
import FormularioEmpresa from '@/components/FormularioEmpresa'

export default function NovaEmpresaPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <h1 className="text-xl font-bold text-gray-800  mb-4">Cadastrar Empresa</h1>
        <FormularioEmpresa />
      </AdminLayout>
    </RequireAdmin>
  )
}
