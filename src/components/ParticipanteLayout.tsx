// src/components/ParticipanteLayout.tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, CalendarCheck2, Building2 } from 'lucide-react'
import BotaoLogout from './BotaoLogout'

const nav = [
  { href: '/dashboard', label: 'Perfil', icon: User },
  { href: '/eventos', label: 'Eventos', icon: CalendarCheck2 },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
]

export default function ParticipanteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow px-4 pt-4 pb-20 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Menu inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around items-center h-16 z-10">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center text-xs ${
              pathname === href ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </Link>
        ))}

        <button
          onClick={() => document.getElementById('logout-btn')?.click()}
          className="flex flex-col items-center text-xs text-red-500 hover:text-red-600"
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Sair
        </button>

        <div className="hidden">
          <BotaoLogout />
        </div>
      </nav>
    </div>
  )
}
