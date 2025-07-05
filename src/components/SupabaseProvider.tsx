'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import {
  SessionContextProvider,
  useSession,
} from '@supabase/auth-helpers-react'
import { Session, SupabaseClient } from '@supabase/supabase-js'

type SupabaseContextType = {
  supabase: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      subscription?.subscription?.unsubscribe?.()
    }
  }, [supabaseClient])

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <SupabaseContext.Provider value={{ supabase: supabaseClient, session }}>
        {children}
      </SupabaseContext.Provider>
    </SessionContextProvider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
