'use client'

import { useSupabase } from './SupabaseProvider'

export default function SessionDebug() {
  const { session, supabase } = useSupabase()

  const checkSession = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    console.log('Sessão atual:', currentSession)
    console.log('Sessão do contexto:', session)
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    console.log('Refresh da sessão:', { data, error })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50">
      <div className="mb-2">
        <strong>Sessão:</strong> {session ? '✅ Ativa' : '❌ Inativa'}
      </div>
      <div className="mb-2">
        <strong>User ID:</strong> {session?.user?.id || 'N/A'}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {session?.user?.email || 'N/A'}
      </div>
      <div className="flex gap-2">
        <button
          onClick={checkSession}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Check
        </button>
        <button
          onClick={refreshSession}
          className="bg-green-600 px-2 py-1 rounded text-xs"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
