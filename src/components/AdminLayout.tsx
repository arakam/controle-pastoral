'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  UserPlus,
  LogOut,
} from 'lucide-react'
import BotaoLogout from './BotaoLogout'

const navLinks = [
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/cadastro', label: 'Cadastrar', icon: UserPlus },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow px-4 pt-4 pb-20 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Menu inferior estilo app */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-10 flex justify-around items-center h-16">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const ativo = pathname.startsWith(href)
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

        {/* Botão de logout como ícone */}
        <button
          onClick={() => document.getElementById('logout-btn')?.click()}
          className="flex flex-col items-center text-xs text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mb-1" />
          Sair
        </button>

        {/* Componente oculto para reaproveitar BotaoLogout */}
        <div className="hidden">
          <BotaoLogout />
        </div>
      </nav>
    </div>
  )
}
