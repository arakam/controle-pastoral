'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from './SupabaseProvider'
import { LogOut } from 'lucide-react'

export default function BotaoLogout() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
        return
      }
      
      // Limpar qualquer estado local se necessário
      router.push('/login')
      router.refresh() // Força atualização da rota
    } catch (error) {
      console.error('Erro inesperado no logout:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex flex-col items-center text-xs text-red-500 hover:text-red-600 transition-colors"
    >
      <LogOut className="w-5 h-5 mb-1" />
      <span>Sair</span>
    </button>
  )
}
