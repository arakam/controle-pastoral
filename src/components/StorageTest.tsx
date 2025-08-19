'use client'

import { useState } from 'react'
import { useSupabase } from './SupabaseProvider'

export default function StorageTest() {
  const { supabase } = useSupabase()
  const [testando, setTestando] = useState(false)
  const [resultado, setResultado] = useState<string>('')

  const testarStorage = async () => {
    setTestando(true)
    setResultado('Testando...')

    try {
      // Teste 1: Verificar se o bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        setResultado(`❌ Erro ao listar buckets: ${bucketsError.message}`)
        return
      }

      const bucketEmpresaImages = buckets.find(b => b.name === 'empresa-images')
      
      if (!bucketEmpresaImages) {
        setResultado('❌ Bucket "empresa-images" não encontrado!\n\nCrie o bucket no painel do Supabase:\n1. Vá para Storage\n2. Clique em "Create bucket"\n3. Nome: empresa-images\n4. Marque como público')
        return
      }

      // Teste 2: Verificar se o bucket é público
      if (!bucketEmpresaImages.public) {
        setResultado('❌ Bucket "empresa-images" não é público!\n\nNo painel do Supabase:\n1. Vá para Storage > empresa-images\n2. Settings > Public bucket: ✅')
        return
      }

      // Teste 3: Tentar fazer upload de teste
      const arquivoTeste = new File(['teste'], 'teste.txt', { type: 'text/plain' })
      const { error: uploadError } = await supabase.storage
        .from('empresa-images')
        .upload('teste/teste.txt', arquivoTeste)

      if (uploadError) {
        setResultado(`❌ Erro no upload de teste: ${uploadError.message}\n\nVerifique as políticas de segurança no SQL Editor`)
        return
      }

      // Teste 4: Limpar arquivo de teste
      await supabase.storage
        .from('empresa-images')
        .remove(['teste/teste.txt'])

      setResultado('✅ Storage funcionando perfeitamente!\n\n- Bucket existe\n- Bucket é público\n- Upload funcionando\n- Políticas configuradas')

    } catch (error) {
      setResultado(`❌ Erro inesperado: ${error}`)
    } finally {
      setTestando(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">🧪 Teste do Storage</h3>
      
      <button
        onClick={testarStorage}
        disabled={testando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {testando ? 'Testando...' : 'Testar Storage'}
      </button>

      {resultado && (
        <div className="bg-gray-50 p-4 rounded border">
          <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>O que este teste verifica:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Se o bucket "empresa-images" existe</li>
          <li>Se o bucket é público</li>
          <li>Se as políticas de segurança estão funcionando</li>
          <li>Se o upload está funcionando</li>
        </ul>
      </div>
    </div>
  )
}
