'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'
import BotaoLogout from './BotaoLogout'
import { Home, Calendar, Building2 } from 'lucide-react'

export default function ParticipanteLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase()
  const pathname = usePathname()

  const menu = [
    { label: 'Perfil', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Eventos', path: '/eventos', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Empresas', path: '/empresas', icon: <Building2 className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800  text-gray-800">Controle Pastoral</h1>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span className="hidden sm:inline">{session?.user?.email}</span>
          <BotaoLogout />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4">{children}</main>

      {/* Menu inferior estilo app */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-inner flex justify-around py-2 z-50">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center text-xs ${
              pathname === item.path ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
