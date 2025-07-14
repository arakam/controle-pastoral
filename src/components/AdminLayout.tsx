'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,   // Eventos
  UserRound,      // Pessoas
  Building2,      // Empresas
  LogOut,         // Sair
  Home,           // Início
} from 'lucide-react'

import BotaoLogout from './BotaoLogout'

// Lista de links do menu inferior
const navLinks = [
  { href: '/admin', label: 'Início', icon: Home },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/pessoas', label: 'Pessoas', icon: UserRound },
  { href: '/admin/empresas', label: 'Empresas', icon: Building2 },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conteúdo principal */}
      <main className="flex-grow px-4 pt-4 pb-20 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Menu inferior fixo */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-10 flex justify-around items-center h-16">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const ativo = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                ativo ? 'text-blue-600' : 'text-gray-500'
              } hover:text-blue-600`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{label}</span>
            </Link>
          )
        })}

        {/* Botão Sair */}
        <button
          onClick={() => document.getElementById('logout-btn')?.click()}
          className="flex flex-col items-center text-xs text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mb-1" />
          Sair
        </button>

        {/* Componente de logout escondido */}
        <div className="hidden">
          <BotaoLogout />
        </div>
      </nav>
    </div>
  )
}
