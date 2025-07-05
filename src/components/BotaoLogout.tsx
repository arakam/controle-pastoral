'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from './SupabaseProvider'

export default function BotaoLogout() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Sair
    </button>
  )
}
